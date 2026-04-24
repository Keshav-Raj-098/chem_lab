"use client";

import React, { useState } from "react";
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
import { Plus } from "lucide-react";

interface CreateEquipmentProps {
  onSuccess: () => void;
}

const CreateEquipment = ({ onSuccess }: CreateEquipmentProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    installedOn: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateEquipment = async () => {
    const { name, manufacturer, model, serialNumber, installedOn, category } = formData;
    if (!name || !manufacturer || !model || !serialNumber || !installedOn || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/admin/equipments", formData);

      toast.success("Equipment created successfully");
      setFormData({
        name: "",
        manufacturer: "",
        model: "",
        serialNumber: "",
        installedOn: "",
        category: "",
      });
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error creating equipment:", error);
      toast.error(error.response?.data?.error || "Failed to create equipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
        <Plus className="mr-2 h-4 w-4" /> Add Equipment
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Equipment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Spectrometer" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g. Analytics" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input id="manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" name="model" value={formData.model} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input id="serialNumber" name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="installedOn">Installed On</Label>
                <Input id="installedOn" name="installedOn" type="date" value={formData.installedOn} onChange={handleInputChange} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEquipment} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Adding..." : "Add Equipment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateEquipment;
