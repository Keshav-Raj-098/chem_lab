import { toast } from "sonner"

export const ShowToast = (message: string, type: "success" | "error") => {
    if (type === "success") {
        toast.success(message);
    } else if (type === "error") {
        toast.error(message);
    }
}
