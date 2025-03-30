import { columns } from "@/components/doctor/table/columns";
import { DataTable } from "@/components/doctor/table/data-table";
import { getAllDoctors } from "@/services/doctor.services";

const DoctorsPage = async () => {
  const doctors = await getAllDoctors();
  
  return (
    <div className="container mx-auto bg-white p-10 rounded-sm">
      <DataTable columns={columns} data={doctors} />
    </div>
  )
}

export default DoctorsPage