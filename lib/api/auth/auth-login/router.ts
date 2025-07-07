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

    // Simpan token di localStorage atau cookie jika dibutuhkan
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("user_email", data.user.email);
    }

    return data;
  } catch (error) {
    throw new Error(
      (error as Error).message || "Terjadi kesalahan saat login"
    );
  }
}
