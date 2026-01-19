import { ROUTES } from "@/config/routes";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { Icon } from "@repo/ui/icon";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Separator } from "@repo/ui/separator";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Signin() {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const navigate = useNavigate();

	const toggleVisibility = () => setIsVisible((prevState) => !prevState);

	const handleNavigateToSignup = () => {
		navigate(ROUTES.SIGNUP);
	};

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="mx-auto w-full max-w-xs space-y-6">
				<div className="space-y-2 text-center">
					<Icon name="bell" className="mx-auto h-16 w-16" />
					<h1 className="text-3xl font-semibold">Welcome back</h1>
					<p className="text-muted-foreground">
						Sign in to access to your dashboard, settings and projects.
					</p>
				</div>

				<div className="space-y-5">
					<Button variant="outline" className="w-full justify-center gap-2">
						<Icon name="google" className="h-4 w-4" />
						Sign in with Google
					</Button>

					<div className="flex items-center gap-2">
						<Separator className="flex-1" />
						<span className="text-sm text-muted-foreground">
							or sign in with email
						</span>
						<Separator className="flex-1" />
					</div>

					<div className="space-y-6">
						<div>
							<Label htmlFor="email">Email</Label>
							<div className="relative mt-2.5">
								<Input
									id="email"
									className="peer ps-9"
									placeholder="ephraim@blocks.so"
									type="email"
								/>
								<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
									<Mail size={16} aria-hidden="true" />
								</div>
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
								<a href="#" className="text-sm text-primary hover:underline">
									Forgot Password?
								</a>
							</div>
							<div className="relative mt-2.5">
								<Input
									id="password"
									className="ps-9 pe-9"
									placeholder="Enter your password"
									type={isVisible ? "text" : "password"}
								/>
								<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
									<Lock size={16} aria-hidden="true" />
								</div>
								<button
									className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
									type="button"
									onClick={toggleVisibility}
									aria-label={isVisible ? "Hide password" : "Show password"}
									aria-pressed={isVisible}
									aria-controls="password"
								>
									{isVisible ? (
										<EyeOff size={16} aria-hidden="true" />
									) : (
										<Eye size={16} aria-hidden="true" />
									)}
								</button>
							</div>
						</div>

						<div className="flex items-center gap-2 pt-1">
							<Checkbox id="remember-me" />
							<Label htmlFor="remember-me">Remember for 30 days</Label>
						</div>
					</div>

					<Button className="w-full">
						Sign in
						<ArrowRight className="h-4 w-4" />
					</Button>

					<div className="text-center text-sm">
						No account?{" "}
						<button
							type="button"
							onClick={handleNavigateToSignup}
							className="text-primary font-medium hover:underline"
						>
							Create an account
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
