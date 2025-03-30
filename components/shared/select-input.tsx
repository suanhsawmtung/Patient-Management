import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { InputItemType } from "@/types/common.types";
import { type Control, type FieldValues, type Path } from "react-hook-form"
  
interface SelectInputPropsType<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>; // ✅ Explicitly define type
    label: string;
    placeholder: string;
    items: readonly InputItemType[]
}
  
export const SelectInput = <T extends FieldValues>({
    control, 
    name,
    label,
    placeholder,
    items
}: SelectInputPropsType<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className="w-full">
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {items.map((item) => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
  