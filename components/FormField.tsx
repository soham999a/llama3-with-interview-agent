import { Controller, Control, FieldValues, Path } from "react-hook-form";

import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: FormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium text-sm mb-1.5">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              className="bg-white rounded-[1.25rem] py-2.5 px-4 border border-gray-300 text-gray-800 placeholder:text-gray-400 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all"
              type={type}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage className="text-red-500 text-xs mt-1" />
        </FormItem>
      )}
    />
  );
};

export default FormField;
