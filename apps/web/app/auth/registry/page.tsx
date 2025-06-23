'use client'
import React from "react";
import { Form, Input, Checkbox, Button, HeroUIProvider } from '@heroui/react';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'next/navigation';

interface FormData {
    name: string;
    email: string;
    password: string;
    country?: string;
    terms?: string;
}

interface FormErrors {
    name?: string;
    password?: string;
    terms?: string;
    [key: string]: string | undefined;
}

export default function App() {
    const router = useRouter()
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [submitted, setSubmitted] = React.useState<FormData | null>(null);
    const [errors, setErrors] = React.useState<any>({});
    const {register} = useAuth()
    // Real-time password validation
    const getPasswordError = (value: string): string | null => {
        if (value.length < 4) {
            return "Password must be 4 characters or more";
        }
        if ((value.match(/[A-Z]/g) || []).length < 1) {
            return "Password needs at least 1 uppercase letter";
        }
        if ((value.match(/[^a-z]/gi) || []).length < 1) {
            return "Password needs at least 1 symbol";
        }

        return null;
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data:any = Object.fromEntries(formData.entries());

        // Custom validation checks
        const newErrors:any = {};

        // Password validation
        if (data.password) {
            const passwordError = getPasswordError(data.password);
            if (passwordError) {
                newErrors.password = passwordError;
            }
        }

        // Username validation
        if (data.name === "admin") {
            newErrors.name = "Nice try! Choose a different username";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (data.terms !== "true") {
            setErrors({ terms: "Please accept the terms" });
            return;
        }

        // Clear errors and submit
        setErrors({});
        register(data.email, data.password, data.name)
    };

    return (
      <HeroUIProvider>
          <Form
            className="w-full justify-center items-center space-y-4 mt-20"
            validationErrors={errors}
            onReset={() => setSubmitted(null)}
            onSubmit={onSubmit}
          >
              <div className="flex flex-col gap-4 max-w-md">
                  <Input
                    isRequired
                    errorMessage={({ validationDetails }: { validationDetails: { valueMissing: boolean } }) => {
                        if (validationDetails.valueMissing) {
                            return "Please enter your name";
                        }
                        return errors.name;
                    }}
                    label="Name"
                    labelPlacement="outside"
                    name="name"
                    placeholder="Enter your name"
                    value={name}
                    onValueChange={setName}
                  />

                  <Input
                    isRequired
                    errorMessage={({ validationDetails }: {
                        validationDetails: { valueMissing: boolean; typeMismatch: boolean }
                    }) => {
                        if (validationDetails.valueMissing) {
                            return "Please enter your email";
                        }
                        if (validationDetails.typeMismatch) {
                            return "Please enter a valid email address";
                        }
                    }}
                    label="Email"
                    labelPlacement="outside"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onValueChange={setEmail}
                  />

                  <Input
                    isRequired
                    errorMessage={getPasswordError(password)}
                    isInvalid={getPasswordError(password) !== null}
                    label="Password"
                    labelPlacement="outside"
                    name="password"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onValueChange={setPassword}
                  />

                  <Checkbox
                    isRequired
                    classNames={{
                        label: "text-small",
                    }}
                    isInvalid={!!errors.terms}
                    name="terms"
                    validationBehavior="aria"
                    value="true"
                    onValueChange={() => setErrors((prev: any) => ({ ...prev, terms: undefined }))}
                  >
                      I agree to the terms and conditions
                  </Checkbox>

                  {errors.terms && <span className="text-danger text-small">{errors.terms}</span>}

                  <div className="flex gap-4">
                      <Button className="w-full" color="primary" type="submit">
                          Submit
                      </Button>
                      <Button type="reset" variant="bordered">
                          Reset
                      </Button>
                  </div>
              </div>

              {submitted && (
                <div className="text-small text-default-500 mt-4">
                    Submitted data: <pre>{JSON.stringify(submitted, null, 2)}</pre>
                </div>
              )}
          </Form>
      </HeroUIProvider>
    );
}