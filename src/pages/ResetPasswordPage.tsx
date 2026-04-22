import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { toast } from "sonner";

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await api.put(`/auth/reset-password/${token}`, { password });
            toast.success("Password updated");
            navigate("/login");
        } catch (err: any) {
            toast.error(err.response?.data?.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Reset Password
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        required
                        placeholder="New password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-1"
                    />

                    <button className="w-full h-11 rounded-xl bg-primary text-white font-semibold">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;