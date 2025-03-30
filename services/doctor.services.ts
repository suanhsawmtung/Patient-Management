import { doctors } from "@/data/doctor.data";
import { DoctorFormSchemaType, DoctorType } from "@/types/doctor.types";

export const getAllDoctors = async (): Promise<DoctorType[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(doctors);
    }, 1500);
  });
}

export const getDoctor = async (id: string): Promise<DoctorType> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(doctors.filter(doctor => doctor.id === id)[0]);
    }, 1500);
  });
}

export const createDoctor = async (data: DoctorFormSchemaType) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDoctor = {
        ...data,
        id: Math.random().toString(10),
        pending_appointment: 0,
        complete_appointment: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      doctors.unshift(newDoctor); // Add to the beginning of the array
      resolve(newDoctor); // Return the created doctor object
    }, 1500);
  });
}

export const updateDoctor = async (id: string, updateData: DoctorFormSchemaType) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const indx = doctors.findIndex(doctor => doctor.id === id);

      if (indx === -1) {
        reject(new Error("Doctor not found"));
        return;
      }

      doctors[indx] = { ...doctors[indx], ...updateData };
      resolve({ ...doctors[indx], ...updateData });;
    }, 1500);
  });
}

export const deleteDoctor = async (id: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const indx = doctors.findIndex(doctor => doctor.id === id);

      if (indx === -1) {
        reject(new Error("Doctor not found"));
        return;
      }

      const deletedDoctor = doctors.splice(indx, 1)[0]; // Remove and store deleted doctor
      resolve(deletedDoctor); // Return the deleted doctor object
    }, 1500);
  });
};