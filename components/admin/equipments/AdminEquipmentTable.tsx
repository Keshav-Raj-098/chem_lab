"use client";

import React, { useState } from "react";
import { GenericDataTable, Column } from "@/components/admin/GenericDataTable";
import axios from "@/lib/axiosConfig";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  installedOn: string;
  category: string;
}

interface AdminEquipmentTableProps {
  refreshTrigger: number;
  setRefreshTrigger: React.Dispatch<React.SetStateAction<number>>;
}

export default function AdminEquipmentTable({ refreshTrigger, setRefreshTrigger }: AdminEquipmentTableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

  // Form state for editing
  const [editData, setEditData] = useState({
    name: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    installedOn: "",
    category: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEquipments = async (page: number, limit: number) => {
    const response = await axios.get(`/admin/equipments?page=${page}&limit=${limit}`);
    return {
      data: response.data.equipments,
      meta: response.data.meta,
    };
  };

  const handleEdit = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setEditData({
      name: equipment.name,
      manufacturer: equipment.manufacturer,
      model: equipment.model,
      serialNumber: equipment.serialNumber,
      installedOn: equipment.installedOn.split('T')[0], // Extract date part
      category: equipment.category,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setDeleteDialogOpen(true);
  };

  const confirmUpdate = async () => {
    if (!selectedEquipment) return;
    try {
      setIsUpdating(true);
      await axios.put(`/admin/equipments/${selectedEquipment.id}`, editData);
      toast.success("Equipment updated successfully");
      setEditDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update equipment");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedEquipment) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/admin/equipments/${selectedEquipment.id}`);
      toast.success("Equipment deleted successfully");
      setDeleteDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete equipment");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Equipment>[] = [
    { header: "Name", accessorKey: "name" },
    { header: "Manufacturer", accessorKey: "manufacturer" },
    { header: "Model", accessorKey: "model" },
    { header: "Category", accessorKey: "category" },
    { 
      header: "Installed On", 
      accessorKey: "installedOn",
      cell: (row: Equipment) => new Date(row.installedOn).toLocaleDateString()
    },
  ];

  return (
    <>
      <GenericDataTable
        columns={columns}
        fetchData={fetchEquipments}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        refreshTrigger={refreshTrigger}
      />

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input id="edit-category" value={editData.category} onChange={(e) => setEditData({...editData, category: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-manufacturer">Manufacturer</Label>
                <Input id="edit-manufacturer" value={editData.manufacturer} onChange={(e) => setEditData({...editData, manufacturer: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-model">Model</Label>
                <Input id="edit-model" value={editData.model} onChange={(e) => setEditData({...editData, model: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-serial">Serial Number</Label>
                <Input id="edit-serial" value={editData.serialNumber} onChange={(e) => setEditData({...editData, serialNumber: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-installed">Installed On</Label>
                <Input id="edit-installed" type="date" value={editData.installedOn} onChange={(e) => setEditData({...editData, installedOn: e.target.value})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Equipment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this equipment record?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
