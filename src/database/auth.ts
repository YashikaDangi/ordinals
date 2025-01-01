// /lib/auth.ts
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import Inscription from "@/models/Inscriptions";

const authConfig = {
  providers: [
    // Your providers here
  ],
  
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, user }: any) {
      session.user.id = user.id; // Attach user ID to the session
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export async function auth() {
  const session = await getServerSession(authConfig);

  if (session?.user) {
    const user = await User.findOne({ email: session.user.email });
    if (user) {
      session.user._id = user._id;

      // Fetch saved items
      const savedItems = await Inscription.find({ savedBy: user._id });
      session.user.savedItems = savedItems; // Include saved items in session
    }
  }

  return session;
}
