import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  FormControl,
  FormField,
  FormMessage,
  Form,
  FormItem,
} from "../components/ui/form";
import { useDispatch, useSelector } from "react-redux";
import { authenticateUser } from "../redux/authSlice/asyncThunks";
import type { AppDispatch } from "../config/store";
import { selectorLoadingAuthentication } from "../redux/authSlice";

const formSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, {
    message: "A senha deve ter pelo menos 8 caracteres",
  }),
});

export function Login() {
  const dispatch = useDispatch<AppDispatch>();

  const loadingLogin = useSelector(selectorLoadingAuthentication);
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    dispatch(authenticateUser(values));
  };
  const formh = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[url(/login-bg.png)] bg-cover bg-no-repeat bg-center">
      <Card className="bg-[rgba(0,0,0,.65)] border-none flex flex-col items-center justify-center shadow-lg gap-4 px-8 w-xs rounded-lg py-6">
        <h1 className="text-white m-0 text-3xl opacity-100 font-bold">Login</h1>
        <Form {...formh}>
          <form
            onSubmit={formh.handleSubmit(handleSubmit)}
            className="flex flex-col items-center justify-center gap-3 w-full"
          >
            <FormField
              control={formh.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Email"
                      className="text-white placeholder:white w-full p-5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formh.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      className="text-white placeholder:white w-full p-5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full p-5 cursor-pointer bg-neutral-900 text-white text-lg"
            >
              {loadingLogin ? "Loading..." : "Log in"}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
