export function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#09090f]">
			{/* Gradient orbs */}
			<div
				className="pointer-events-none absolute -top-[30%] -left-[10%] h-[700px] w-[700px] rounded-full opacity-30 blur-[120px]"
				style={{
					background:
						"radial-gradient(circle, hsl(262 83% 58% / 0.6) 0%, transparent 70%)",
				}}
			/>
			<div
				className="pointer-events-none absolute -right-[5%] -bottom-[20%] h-[500px] w-[500px] rounded-full opacity-20 blur-[100px]"
				style={{
					background:
						"radial-gradient(circle, hsl(280 70% 50% / 0.5) 0%, transparent 70%)",
				}}
			/>
			<div
				className="pointer-events-none absolute top-[20%] right-[15%] h-[300px] w-[300px] rounded-full opacity-15 blur-[80px]"
				style={{
					background:
						"radial-gradient(circle, hsl(230 80% 60% / 0.4) 0%, transparent 70%)",
				}}
			/>

			{/* Noise texture overlay */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
					backgroundRepeat: "repeat",
					backgroundSize: "128px 128px",
				}}
			/>

			{/* Subtle grid */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.04]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
					backgroundSize: "64px 64px",
				}}
			/>

			{/* Content */}
			<div className="relative z-10 w-full">{children}</div>
		</div>
	);
}
