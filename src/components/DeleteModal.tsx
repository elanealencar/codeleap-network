import axios from "axios";
import { useState } from "react";

type DeleteModalProps = {
    postId: string;
    onClose: () => void;
    onDeleteSuccess: () => void;
  };
  
  export default function DeleteModal({ postId, onClose, onDeleteSuccess }: DeleteModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    
    const handleDelete = async () => {
      setIsDeleting(true);
      try {
        await axios.delete(`https://dev.codeleap.co.uk/careers/${postId}/`);
        console.log("Deletando o post com ID:", postId);

        await onDeleteSuccess(); 
      } catch (error) {
        console.error("Erro ao deletar o post:", error);
        if (axios.isAxiosError(error)) {
          console.error("Erro na requisição:", error.response?.data);
        }
      } finally {
        setIsDeleting(false);
        onClose(); 
      }
    };

    
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="w-[660px] h-[146px] bg-white rounded-2xl border-[2px] border-[#999999] p-6 flex flex-col">
          <p className="text-[22px] text-black font-bold pb-8">Are you sure you want to delete this item?</p>
          <div className="flex justify-end gap-4">
            <button
              className="w-[120px] h-[32px] bg-white text-black text-[16px] rounded-lg border-[1px] border-[#999999]"
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className="w-[120px] h-[32px] bg-red-500 text-white text-[16px] rounded-lg"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  