import { Button } from "lib-kit-components";
import { LogOutIcon } from "@/components/atoms/icons";
import { logout } from "@/lib/auth/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="ghost" leftIcon={<LogOutIcon className="h-4 w-4" />}>
        Cerrar sesión
      </Button>
    </form>
  );
}
