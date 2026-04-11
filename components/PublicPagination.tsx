import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const PublicPagination = ({ currentPage, totalPages, onPageChange, loading }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || loading}
        className="rounded-full px-4 gap-2 border-gray-200 hover:bg-gray-50 hover:text-blue-600 transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>
      
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          const isActive = pageNum === currentPage;
          
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              disabled={loading}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                isActive 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                  : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-100 hover:border-blue-200"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || loading}
        className="rounded-full px-4 gap-2 border-gray-200 hover:bg-gray-50 hover:text-blue-600 transition-all"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default PublicPagination;
