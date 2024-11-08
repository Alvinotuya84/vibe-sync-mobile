import { useToast } from "@/components/toast-manager";
import { useState } from "react";
import { ZodError, ZodTypeAny } from "zod";

type FormField<T extends string> = {
    name: T;
    value: any;
    schema: ZodTypeAny;
};

type FormFields<T extends string> = FormField<T>[];

type FormState<T extends string> = {
    [key in T]: any;
};

type FormActions<T extends string> = {
    setFormValue: (name: T, value: any) => void;
    getFormValue: (name: T) => any;
    resetForm: () => void;
    validateForm: (
        onSuccess?: (data: {
            [key in T]: any
        }) => any
    ) => boolean;
    formState: FormState<T>;
};


const useForm = <T extends string>(fields: FormFields<T>): FormActions<T> => {
    const { showToast } = useToast();


    let formStateInit: {
        [key in T]: any
    } = {} as any;

    fields.forEach(field => {
        formStateInit[field.name] = field.value
    })

    const [formState, setFormState] = useState<FormState<T>>(formStateInit);

    const validFieldNames = fields.map((field) => field.name) as T[];

    const setValue = (name: T, value: any) => {
        if (validFieldNames.includes(name)) {
            setFormState((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            console.error(`Invalid field name: ${name}`);
        }
    };

    const getValue = (name: T) => {
        return formState[name];
    };

    const reset = () => {
        setFormState(formStateInit);
    };

    const errors: string[] = [];

    const validate = (onSuccess: FormActions<T>["validateForm"]['arguments']) => {
        let isValid = true;

        for (const field of fields) {
            if (field.schema.isOptional()) {
                continue;
            }
            try {
                field.schema.parse(formState[field.name]);
            } catch (error) {
                if (error instanceof ZodError) {
                    errors.push(error.errors[0].message || `${error.errors[0].path.join(".")} is invalid`);
                }
                isValid = false;
            }
        }
        if (isValid) {
            onSuccess(formState);
            return isValid;
        } else {
            showToast({
                title: errors[0],
                type: "error",
            });
            return isValid;
        }
    };

    return {
        setFormValue: setValue,
        getFormValue: getValue,
        resetForm: reset,
        formState,
        validateForm: validate,
    };
};

export default useForm;
