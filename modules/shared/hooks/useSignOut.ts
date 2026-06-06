"use client";

import { useRouter } from "next/navigation";
import { sileo } from "sileo";
import { signOut } from "@/modules/shared/actions/authActions";

export function useSignOut() {
  const router = useRouter();

  return () =>
    sileo.promise(async () => {
      const result = await signOut();
      if (result?.error) throw new Error(result.error);
      router.push("/login");
      router.refresh();
    }, {
      loading: { title: "Cerrando sesión..." },
      success: { title: "Sesión cerrada" },
      error: { title: "Error al cerrar sesión" },
    });
}
