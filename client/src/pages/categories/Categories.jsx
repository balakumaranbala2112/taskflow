import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FolderKanban,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Calendar,
  Layers,
} from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";

const COLOR_PRESETS = [
  "#2563eb", // Blue
  "#7c3aed", // Violet
  "#059669", // Emerald
  "#d97706", // Amber
  "#e11d48", // Rose
  "#0891b2", // Cyan
  "#4f46e5", // Indigo
  "#64748b", // Slate
];

function Categories() {
  const queryClient = useQueryClient();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#2563eb",
  });
  const [formError, setFormError] = useState("");

  // Query
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Mutations
  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      setIsCreateModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      setFormError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          "Failed to create category"
      );
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ categoryId, categoryData }) =>
      updateCategory(categoryId, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      setEditingCategory(null);
      resetForm();
    },
    onError: (err) => {
      setFormError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          "Failed to update category"
      );
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      setDeletingCategory(null);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#2563eb",
    });
    setFormError("");
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      color: category.color || "#2563eb",
    });
    setFormError("");
  };

  const handleSubmitCreate = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Category name is required");
      return;
    }
    createCategoryMutation.mutate({
      name: formData.name.trim(),
      description: formData.description.trim(),
      color: formData.color,
    });
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Category name is required");
      return;
    }
    updateCategoryMutation.mutate({
      categoryId: editingCategory._id,
      categoryData: {
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color,
      },
    });
  };

  const handleConfirmDelete = () => {
    if (deletingCategory) {
      deleteCategoryMutation.mutate(deletingCategory._id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Categories
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Organize and group your tasks into tailored workspaces.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
          New Category
        </Button>
      </div>

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load categories: {error?.message || "Unknown error"}
        </div>
      )}

      {/* Categories Grid */}
      {categories?.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xs">
          <EmptyState
            title="No categories found"
            message="Create your first category like 'Work', 'Personal', or 'Urgent' to organize your tasks."
          />
          <div className="mt-6 text-center">
            <Button variant="primary" icon={Plus} onClick={handleOpenCreate}>
              Create Category
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories?.map((category) => (
            <div
              key={category._id}
              className="group relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition hover:border-gray-200 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3.5 w-3.5 rounded-full shadow-xs"
                      style={{ backgroundColor: category.color || "#64748b" }}
                    />
                    <h3 className="text-base font-bold text-gray-900 truncate max-w-[170px]">
                      {category.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 opacity-90 transition">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(category)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
                      title="Edit Category"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingCategory(category)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Delete Category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-xs text-gray-500 line-clamp-3 min-h-[32px]">
                  {category.description || "No description provided."}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(category.createdAt).toLocaleDateString()}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider"
                  style={{ backgroundColor: category.color || "#64748b" }}
                >
                  Category
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="Create Category"
      >
        <form onSubmit={handleSubmitCreate} className="space-y-4">
          {formError && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
              {formError}
            </div>
          )}

          <Input
            label="Category Name"
            name="name"
            placeholder="e.g., Marketing, Development, Personal"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          <Textarea
            label="Description (Optional)"
            name="description"
            placeholder="What kind of tasks belong in this category?"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={2}
          />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-2">
              Color Theme
            </label>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {COLOR_PRESETS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: hex })}
                  className={`h-8 w-8 rounded-full transition-transform ${
                    formData.color === hex
                      ? "ring-2 ring-blue-600 ring-offset-2 scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>

            <Input
              label="Custom Hex Color"
              name="color"
              placeholder="#2563eb"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={createCategoryMutation.isPending}
            >
              Create Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={Boolean(editingCategory)}
        onClose={() => {
          setEditingCategory(null);
          resetForm();
        }}
        title="Edit Category"
      >
        <form onSubmit={handleSubmitEdit} className="space-y-4">
          {formError && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-200">
              {formError}
            </div>
          )}

          <Input
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          <Textarea
            label="Description (Optional)"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={2}
          />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-2">
              Color Theme
            </label>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {COLOR_PRESETS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: hex })}
                  className={`h-8 w-8 rounded-full transition-transform ${
                    formData.color === hex
                      ? "ring-2 ring-blue-600 ring-offset-2 scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>

            <Input
              label="Custom Hex Color"
              name="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              type="button"
              onClick={() => setEditingCategory(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              loading={updateCategoryMutation.isPending}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        title="Delete Category"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600 bg-red-50 p-3 rounded-xl">
            <AlertCircle className="h-6 w-6 shrink-0" />
            <p className="text-sm font-medium">
              Are you sure you want to delete category{" "}
              <span className="font-bold">"{deletingCategory?.name}"</span>?
            </p>
          </div>

          <p className="text-xs text-gray-500">
            Tasks assigned to this category will have their category unassigned,
            but the tasks themselves will not be deleted.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setDeletingCategory(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={deleteCategoryMutation.isPending}
              onClick={handleConfirmDelete}
            >
              Delete Category
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Categories;