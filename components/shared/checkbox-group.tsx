import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { type Control, type FieldValues, type Path } from "react-hook-form"
import { Checkbox } from "../ui/checkbox";
import { InputItemType } from "@/types/common.types";
  
interface CheckboxGroupPropsType<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>; // ✅ Explicitly define type
    label: string;
    direction?: "horizontal" | "vertical";
    items: readonly InputItemType[]
}
  
export const CheckboxGroup = <T extends FieldValues>({
    control, 
    name,
    label,
    direction = "horizontal",
    items
}: CheckboxGroupPropsType<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={() => (
            <FormItem>
                <FormLabel className="text-base">{label}</FormLabel>
                <div className={`flex flex-wrap gap-y-4 gap-x-6 ${
                        direction === "horizontal" 
                            ? "flex-row justify-start items-center"
                            : "flex-col justify-start items-start "
                    }`}
                >
                    {items.map((item) => (
                        <FormField
                            key={item.id}
                            control={control}
                            name={name}
                            render={({ field }) => {
                            return (
                                <FormItem
                                    key={item.id}
                                    className="flex justify-start items-center"
                                >
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                                return checked
                                                ? field.onChange([...field.value, item.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                        (value: string) => value !== item.id
                                                    )
                                                )
                                            }}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {item.label}
                                    </FormLabel>
                                </FormItem>
                            )
                            }}
                        />
                    ))}
                </div>
                <FormMessage />
            </FormItem>
            )}
        />
    )
}
  