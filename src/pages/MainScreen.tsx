import React from "react";
import { useState, useEffect } from "react";
import iconEdit from "../assets/icon_edit.svg";
import iconDelete from "../assets/icon_delete.svg";
import DeleteModal from "../components/DeleteModal";
import EditModal from "../components/EditModal";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUsername } from "../store/userSlice";


function timeAgo(date: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return "Just now";
  return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
}

type Post = {
  id: string;
  username: string;
  created_datetime: string;
  title: string;
  content: string;
  author_ip?: string;
}

const Mainscreen: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const username = useSelector((state: any) => state.user.username);

  const dispatch = useDispatch();

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      dispatch(setUsername(savedUsername));
    }
  }, [dispatch]);



  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('https://dev.codeleap.co.uk/careers/', {
        username,
        title,
        content
      });
      setTitle("");
      setContent("");
      fetchPosts(); 
    } catch (error) {
      console.error("Erro ao criar o post:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://dev.codeleap.co.uk/careers/');
      setPosts(response.data.results); 
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEditPost = async (postId: string, newTitle: string, newContent: string) => {
    try {
      await axios.patch(`https://dev.codeleap.co.uk/careers/${postId}/`, {
        title: newTitle,
        content: newContent,
      });
      fetchPosts();
    } catch (error) {
      console.error("Erro ao editar o post:", error);
    }
  };

  const handleUpdateSuccess = (newTitle: string, newContent: string) => {
    if (selectedPost) {
      handleEditPost(selectedPost.id, newTitle, newContent); 
    }
  };

  const handleDeleteSuccess = () => {
    setPosts(posts.filter((post) => post.id !== postToDelete?.id));
    setPostToDelete(null); 
  };
  

  return (
    <div className="bg-[#DDDDDD] min-h-screen font-roboto">
      {/* Barra superior */}
      <div className="bg-[#7695EC] w-[800px] mx-auto h-[80px] flex items-center">
        <h1 className="text-white text-[22px] font-bold p-[37px]">CodeLeap Network</h1>
      </div>

      {/* Post creator */}
      <div className="w-[800px] h-auto mx-auto bg-white py-4">
        <div className="w-[752px] h-auto border border-[#999999] border-1 rounded-2xl p-6 flex flex-col mx-auto gap-6 bg-white">
          <h2 className="text-[22px] font-bold">What’s on your mind?</h2>

          <form onSubmit={handlePostSubmit} className="flex flex-col gap-2">
            <label className="text-[16px] text-black">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Hello world"
              className="w-[704px] h-[32px] border border-[#777777] rounded-md px-3 text-[14px] text-[#CCCCCC]"
            />

            <label className="text-[16px] text-black">Content</label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content here"
              className="w-[704px] h-[74px] border border-[#777777] rounded-md px-3 text-[14px] text-[#CCCCCC]"
            />

            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className={`w-[111px] h-[32px] text-white text-[16px] rounded-md ${
                title.trim() && content.trim()
                  ? "bg-[#7695EC]"
                  : "bg-[#7695EC]/50 cursor-not-allowed"
              } ml-auto`}
            >
              Create
            </button>
          </form>
        </div>
      </div>

      {/* Post list */}
      <div className="w-[800px] h-auto mx-auto bg-white py-4">
        <div className="w-[752px] mx-auto flex flex-col gap-4">
          {posts.map((post) => (
            <div key={post.id} className="border border-[#999999] rounded-2xl bg-white">
              {/* Header da postagem */}
              <div className="bg-[#7695EC] h-[80px] px-6 flex items-center justify-between rounded-t-md">
                <h3 className="text-white text-[22px] font-bold">{post.title}</h3>
                <div className="flex gap-4">
                  <img
                    src={iconEdit}
                    alt="edit"
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPost(post);
                      setShowEditModal(true);
                    }}
                  />
                  <img
                    src={iconDelete}
                    alt="delete"
                    className="cursor-pointer"
                    onClick={() => setPostToDelete(post)}
                  />
                </div>
              </div>

              {/* Corpo da postagem */}
              <div className="p-6 flex flex-col gap-3">
                <div className="flex justify-between text-[18px] text-[#777777]">
                  <span className="font-bold">@{username}</span>
                  <span>{timeAgo(post.created_datetime)}</span>
                </div>
                <p className="text-[18px] text-black whitespace-pre-line">{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modais de edição e exclusão */}
      {showEditModal && selectedPost && (
        <EditModal
        postId={selectedPost.id}
        title={selectedPost.title}
        content={selectedPost.content}
        onClose={() => setShowEditModal(false)}
        onUpdateSuccess={handleUpdateSuccess} 
        />
      
      )}

      {postToDelete && (
        <DeleteModal
        postId={postToDelete.id}
        onClose={() => setPostToDelete(null)}
        onDeleteSuccess={handleDeleteSuccess} 
        />
      )}
    </div>
  );
}


export default Mainscreen;