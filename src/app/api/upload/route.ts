import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/shared/lib/cloudinary";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("clarte-access-token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "No autorizado." },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { success: false, message: "No se envió ningún archivo." },
      { status: 400 },
    );
  }

  try {
    const url = await uploadImage(file);
    return NextResponse.json({
      success: true,
      data: { url },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Error al subir imagen.",
      },
      { status: 500 },
    );
  }
}
