import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schemaRules = {
  required: z.string()
    .trim()
    .min(1, { message: "请输入内容" }),
  username: z.string()
    .trim()
    .min(2, { message: "用户名至少需要2个字符" })
    .max(16, { message: "用户名不能超过16个字符" }),
  password: z.string()
    .refine(val => val === "" || (val.length >= 6), { message: "密码至少需要6个字符" })
    .refine(val => val === "" || (val.length <= 24), { message: "密码不能超过24个字符"}),
};

export const createForm = (fields) => {
  return () => {
    const rules = schemaRules;
    
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
