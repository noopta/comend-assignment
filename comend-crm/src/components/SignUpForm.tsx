"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { date, z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Input } from "@/components/ui/input"
import { useState } from 'react'

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    passwordConfirmation: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    firstName: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
    dateOfBirth: date().min(new Date(1900, 1, 1), {
        message: "Date of birth must be after 1900.",
    }),
})

export default function SignUpForm(props: any) {

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
            firstName: "",
            lastName: "",
        },
    })

    const handleRegistration = async (values: { email: string; password: string; passwordConfirmation: string; firstName: string; lastName: string; dateOfBirth: Date }) => {
        await fetch('http://ec2-18-217-249-238.us-east-2.compute.amazonaws.com:8080/api/registerUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                dateOfBirth: values.dateOfBirth,
                password: values.password,
            }),
        }).then(response => {
            if (response.ok) {
                console.log("User registered successfully")
                console.log(response)
            }
        })
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.password !== values.passwordConfirmation) {
            toast.error("Passwords do not match")
            return
        }


        handleRegistration(values)
    }

    return (
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="" {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter your email address.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="" {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is your password.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="passwordConfirmation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password Confirmation</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="" {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Confirm your password
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="" {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter your first name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="" {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Enter your last name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date of birth</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    Your date of birth is used to calculate your age.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex space-x-4">
                        <Button className="space-x-8" type="submit">Submit</Button>
                        <Button
                            onClick={(e) => {
                                e.preventDefault(); props.setRevisitingUser(false)
                            }}
                            className="space-x-8"
                            variant="secondary">Go back</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
