"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { DoctorFormSchemaType, DoctorType } from "@/types/doctor.types";
import { DoctorFormSchema } from "@/validations/doctor.validations";
import { updateDoctor } from "@/services/doctor.services";
import { DoctorForm } from "@/components/doctor/doctor-form";

const EditDoctorForm = ({ doctor }: {
    doctor: DoctorType
}) => {
    const router = useRouter();

    const form = useForm<DoctorFormSchemaType>({
        resolver: zodResolver(DoctorFormSchema),
        defaultValues: {
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            email: doctor.email,
            contact_no: doctor.contact_no,
            title: doctor.title,
            degree: doctor.degree,
            department: doctor.department,
            fees: doctor.fees,
            experience: doctor.experience,
            available_days: doctor.available_days,
            slots_time: doctor.slots_time,
            available_time_from:doctor.available_time_from,
            available_time_to: doctor.available_time_to,
        }
    })

    const handleSubmit = async (updateData: DoctorFormSchemaType) => {
        const updatedDoctor = await updateDoctor(doctor.id, updateData);
        if(updatedDoctor) router.push("/doctors")
    }

    return (
        <DoctorForm
            form={form}
            handleSubmit={handleSubmit} 
        />
    )
}

export default EditDoctorForm