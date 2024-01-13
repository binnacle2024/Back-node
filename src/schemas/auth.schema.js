import {z} from 'zod'

export const registerSchrma = z.object({
    user: z.string({
        required_error: "El usuario es requerido",
    }),
    psw: z
        .string({
            required_error:"La contraseña es requerida",
        })
        .min(6,{
            message:"La contraseña debe tener mínimo 6 caracteres",
        }),
    name: z.string({
        required_error: "El usuario es requerido",
        })
        .min(3,{
            message:"El nombre debe tener mínimo 3 caracteres",
        })
        .max(50,{
            message:"El nombre debe tener máximo 50 caracteres",
        }),
    surname: z.string({
        required_error: "El apellido es requerido",
        })
        .min(3,{
            message:"El apellido debe tener mínimo 3 caracteres",
        })
        .max(50,{
            message:"El apellido debe tener máximo 50 caracteres",
        }),
})

export const loginSchema = z.object({
    user: z.string({
        required_error: "El usuario es requerido",
    }),
    psw: z
        .string({
            required_error:"La contraseña es requerida",
        })
        .min(6,{
            message:"La contraseña debe tener mínimo 6 caracteres",
        })
})