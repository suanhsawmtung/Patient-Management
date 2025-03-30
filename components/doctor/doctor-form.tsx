"use client"

import { CheckboxGroup } from "@/components/shared/checkbox-group"
import { SelectInput } from "@/components/shared/select-input"
import { TextInput } from "@/components/shared/text-input"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { UseFormReturn } from "react-hook-form"
import { DAY_INPUT_DATA, MINUTE_INPUT_DATA } from "@/constants/input.constant"
import { DoctorFormSchemaType } from "@/types/doctor.types"

export const DoctorForm = ({form, handleSubmit}: {
    form: UseFormReturn<DoctorFormSchemaType>;
    handleSubmit: (data: DoctorFormSchemaType) => void
}) => {
  return (
    <Form {...form}>
        <form 
            onSubmit={form.handleSubmit(handleSubmit)} 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
            <TextInput 
                control={form.control} 
                name="firstName" 
                label="First Name" 
                placeholder="Enter first name..."  
            />

            <TextInput 
                control={form.control} 
                name="lastName" 
                label="Last Name" 
                placeholder="Enter last name..."  
            />

            <TextInput 
                control={form.control} 
                name="email" 
                label="Email" 
                type="email"
                placeholder="Enter email..."  
            />

            <TextInput 
                control={form.control} 
                name="contact_no" 
                label="Contact Number" 
                placeholder="Enter contact number..."  
            />

            <TextInput 
                control={form.control} 
                name="title" 
                label="Title" 
                placeholder="Enter your title..."  
            />

            <TextInput 
                control={form.control} 
                name="degree" 
                label="Degree" 
                placeholder="Enter your degree..."  
            />

            <TextInput 
                control={form.control} 
                name="department" 
                label="Department" 
                placeholder="Enter contact department..."  
            />

            <TextInput 
                control={form.control} 
                name="fees" 
                label="Fees" 
                placeholder="Enter your fees..."  
            />

            <TextInput 
                control={form.control} 
                name="experience" 
                label="Experience" 
                placeholder="Enter your experience..."  
            />

            <CheckboxGroup 
                control={form.control} 
                name="available_days" 
                label="Available Days"
                items={DAY_INPUT_DATA} 
            />

            <SelectInput
                control={form.control} 
                name="slots_time" 
                label="Slots Time (In Minute)"
                placeholder="Select time in minute"
                items={MINUTE_INPUT_DATA} 
            />

            <div className="flex justify-between items-center gap-4">
                <div className="w-1/2">
                    <TextInput 
                        control={form.control} 
                        name="available_time_from" 
                        label="From:" 
                        type="time"
                        placeholder="Enter email..."  
                    />
                </div>

                <div className="w-1/2">
                    <TextInput 
                        control={form.control} 
                        name="available_time_to" 
                        label="To:" 
                        type="time"
                        placeholder="Enter email..."  
                    />
                </div>
            </div>

            <Button type="submit">Submit</Button>
        </form>
    </Form>
  )
}