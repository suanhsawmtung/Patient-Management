"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import { DoctorFormSchema } from "../../../validations/doctor.validations"
import { useRouter } from "next/navigation"
import { DoctorFormSchemaType } from "@/types/doctor.types"
import { createDoctor } from "@/services/doctor.services"
import { DoctorForm } from "@/components/doctor/doctor-form"

const CreateDoctorPage = () => {
    const router = useRouter();

    const form = useForm<DoctorFormSchemaType>({
        resolver: zodResolver(DoctorFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            contact_no: "",
            title: "",
            degree: "",
            department: "",
            fees: "",
            experience: "",
            available_days: [],
            slots_time: "",
            available_time_from: "",
            available_time_to: ""
        }
    })

    const handleSubmit = async (createData: DoctorFormSchemaType) => {
        const createdDoctor = await createDoctor(createData);
        if(createdDoctor) router.push("/doctors")
    }

    return (
        <div className="container mx-auto bg-white p-10 rounded-sm">
            <DoctorForm
                form={form}
                handleSubmit={handleSubmit} 
            />
        </div>
    ) 
}

export default CreateDoctorPage