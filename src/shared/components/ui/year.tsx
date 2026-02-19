import { SITE_NAME } from "@/shared/lib/constants";

const GetYear = () => {
    return (
        <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            {SITE_NAME}. Todos los derechos reservados.
        </p>
    );
};

export default GetYear;
