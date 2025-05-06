import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schemaRules = (t) => ({
  required: z.string()
    .trim()
    .min(1, { message: t("validate.required") }),
  username: z.string()
    .trim()
    .min(2, { message: t("validate.username_2") })
    .max(16, { message: t("validate.username_16") }),
  password: z.string()
    .refine(val => val === "" || (val.length >= 6), { message: t("validate.password_6") })
    .refine(val => val === "" || (val.length <= 24), { message: t("validate.password_24") }),
});

export const createForm = (fields) => {
  return () => {
    const { t } = useTranslation();
    const rules = schemaRules(t);
    
    const schema = z.object(
      Object.entries(fields).reduce((acc, [key, config]) => ({
        ...acc,
        [key]: rules[config.schema]
      }), {})
    );

    const defaultValues = Object.entries(fields).reduce((acc, [key, config]) => ({
      ...acc,
      [key]: config.default ?? ""
    }), {});

    return useForm({
      resolver: zodResolver(schema),
      defaultValues
    });
  };
};
