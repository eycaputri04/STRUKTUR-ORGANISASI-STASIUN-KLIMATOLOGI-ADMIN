const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function loginUser(email: string, password: string) {
    try {
        const response = await fetch(`${API_BASE_URL}auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login gagal");
        }

        if (typeof window !== "undefined") {
            sessionStorage.setItem("access_token", data.access_token);
            sessionStorage.setItem("refresh_token", data.refresh_token);
            sessionStorage.setItem("user_id", data.user.id);
            sessionStorage.setItem("user_email", data.user.email);
        }

        return data;
    } catch (error) {
        throw new Error(
            (error as Error).message || "Terjadi kesalahan saat login"
        );
    }
}
