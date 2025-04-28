import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import { setUsername } from "../store/userSlice";

type SignUpModalProps = {
  onSubmit: (username: string) => void;
};

const SignUpModal: React.FC<SignUpModalProps> = () => {
  const [username, setUsernameInput] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      dispatch(setUsername(username));
      localStorage.setItem('username', username);


      fetch("https://dev.codeleap.co.uk/careers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      }).then((response) => {
        if (response.ok) {
          navigate("/main"); // main page
        } else {
          console.error("Erro ao enviar para a API");
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#DDDDDD] font-roboto">
      <div className="bg-[white] rounded-[16px] w-[500px] h-[205px] p-6 shadow-md">
        <h1 className="text-[22px] text-black mb-4 font-bold">Welcome to CodeLeap network!</h1>
        <form onSubmit={handleSubmit} className=" flex flex-col gap-2">
          <label className="block text-black text-[16px]">
            Please enter your username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="John doe"
            className="w-[452px] h-8 border border-[#777777] border-1 rounded-md px-3 text-[14px] text-[#CCCCCC]"
          />
          <button
            type="submit"
            disabled={!username.trim()}
            className={`w-[111px] h-[32px] text-white text-[16px] rounded-md ${
              username.trim() ? "bg-[#7695EC]" : "bg-[#7695EC]/50 cursor-not-allowed"
            } ml-auto`}
          >
            ENTER
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpModal;