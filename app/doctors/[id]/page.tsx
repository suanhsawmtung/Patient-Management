import EditDoctorForm from "@/components/doctor/edit-doctor-form";
import { getDoctor } from "@/services/doctor.services";

const DoctorEditPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const { id } = await params;

    const doctor = await getDoctor(id);

    return (
        <div className="container mx-auto bg-white p-10 rounded-sm">
            <EditDoctorForm doctor={doctor} />
        </div>
    )
}

export default DoctorEditPage;
