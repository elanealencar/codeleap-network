import { useEffect, useState } from "react";

type EditModalProps = {
    postId: string;
    title: string;
    content: string;
    onClose: () => void;
    onUpdateSuccess: (newTitle: string, newContent: string) => void;
  };
  
  
  export default function EditModal({ 
    postId, 
    title,
    content, 
    onClose, 
    onUpdateSuccess 
    }: EditModalProps) {
      const [newTitle, setNewTitle] = useState(title);
      const [newContent, setNewContent] = useState(content);
      const [isSaving, setIsSaving] = useState(false);

      useEffect(() => {
      }, [newTitle, newContent, onUpdateSuccess]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSaving(true);

      try {
        await fetch(`https://dev.codeleap.co.uk/careers/${postId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTitle, content: newContent }),
        });
  
        onUpdateSuccess(newTitle, newContent); // Update list
        onClose();
      } catch (error) {
        console.error("Edit error:", error);
      } finally {
        setIsSaving(false);
      }
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 ">
        <div className="w-[660px] bg-white rounded-2xl border-[2px] border-[#999999] p-6 flex flex-col gap-4">
          <h2 className="text-[22px] text-black font-bold">Edit item</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[16px] text-black">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full h-[32px] border border-[#777777] rounded-md px-3 text-[14px] text-black"
              />
            </div>
  
            <div>
              <label className="text-[16px] text-black">Content</label>
              <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full h-[74px] border border-[#777777] rounded-md px-3 py-2 text-[14px] text-black"
              />
            </div>
  
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-[120px] h-[32px] bg-white text-black font-bold text-[16px] rounded-lg border-[1px] border-[#999999]"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-[120px] h-[32px] bg-[#47B960] text-white font-bold text-[16px] rounded-lg"
                disabled={!newTitle.trim() || !newContent.trim() || isSaving}
                >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  