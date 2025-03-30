"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { type Control, type FieldValues, type Path } from "react-hook-form"

interface TextInputPropsType<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>; // ✅ Explicitly define type
  label: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
}

export const TextInput = <T extends FieldValues>({
  control, 
  name,
  label,
  type = "text",
  placeholder,
}: TextInputPropsType<T>) => {
  return (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input 
                      type={type} 
                      placeholder={placeholder} 
                      {...field} 
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
  )
}
