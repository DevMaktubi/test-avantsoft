import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { selectLoadingClients } from "../../redux/clientSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import moment from "moment";
import type { AppDispatch } from "../../config/store";
import { addClient } from "../../redux/clientSlice/asyncThunks";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres",
  }),
  email: z.string().email("Email inválido"),
  data_nascimento: z.date(),
});

export interface FormUsuarioProps {
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
  closeModal?: () => void;
}

export function FormUsuario(props: FormUsuarioProps) {
  const { closeModal } = props;
  const dispatch = useDispatch<AppDispatch>();
  const loadingClients = useSelector(selectLoadingClients);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      data_nascimento: moment(new Date()).toDate(),
    },
  });
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (values) {
      console.log(values);
      dispatch(addClient(values));
      if (closeModal) {
        closeModal();
      }
      form.reset();
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col items-center justify-center gap-2 w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <Input
                placeholder="Nome"
                type="text"
                className="text-[var(--primary)]  placeholder:white w-full p-5"
                autoComplete="off"
                {...field}
              />
              <FormMessage className="text-center text-[var(--primary)]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <Input
                placeholder="Email"
                className="text-[var(--primary)] placeholder:white w-full p-5"
                autoComplete="off"
                {...field}
              />
              <FormMessage className="text-center text-[var(--primary)]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="data_nascimento"
          render={({ field }) => (            <FormItem className="w-full">
              <div className="relative w-full">
                <Input
                  type="date"
                  placeholder="Data de Nascimento"
                  className="text-[var(--primary)] placeholder:white w-full p-5"
                  autoComplete="off"
                  value={
                    field.value ? moment(field.value).format("YYYY-MM-DD") : ""
                  }
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    field.onChange(date);
                  }}
                />
              </div>
              <FormMessage className="text-center text-[var(--primary)]" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full p-5 cursor-pointer bg-[var(--primary)] text-[#1A161E] font-bold text-lg"
          disabled={!form.formState.isValid || loadingClients}
        >
          {loadingClients ? "Loading..." : "Cadastrar"}
        </Button>
      </form>
    </Form>
  );
}
