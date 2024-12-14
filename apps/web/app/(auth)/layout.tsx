export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// const user = await auth();

	// if (user) {
	// 	return redirect("/dashboard", RedirectType.replace);
	// }

	return <>{children}</>;
}
