// src/components/CreatePost.tsx
import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { createPost, fetchPosts } from '../store/postsSlice';


export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const dispatch = useAppDispatch();
  const username = 'Anonymous'; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    await dispatch(createPost({ username, title, content }));
    dispatch(fetchPosts()); 
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border mb-4">
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded"
      />
      <textarea
        placeholder="Conteúdo"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        Criar Post
      </button>
    </form>
  );
}
