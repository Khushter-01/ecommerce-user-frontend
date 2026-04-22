import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("/auth/forgot-password", { email });

            const token = res.data.resetUrl.split("/").pop();

            toast.success("Reset link generated");
            navigate(`/reset-password/${token}`);
        } catch (err: any) {
            toast.error(err.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-8">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Forgot Password
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring mt-1"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 rounded-xl bg-primary text-white font-semibold"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;