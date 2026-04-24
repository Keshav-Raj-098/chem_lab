import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, ExternalLink, User } from "lucide-react";

interface GroupMember {
  id: string;
  name: string;
  email: string;
  researchAreas: string;
  designation: string | null;
  category: string;
  profileImgUrl: string | null;
  profileLink: string | null;
  phoneNumber: string | null;
}

const getFullImageUrl = (url: string | null) => {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("/")) return url;
  const publicUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
  return publicUrl
    ? `${publicUrl}/${url}`
    : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${url}`;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

const PublicGroupMemberCard = ({ member }: { member: GroupMember }) => {
  const profileImgUrl = getFullImageUrl(member.profileImgUrl);

  return (
    <article className="group flex flex-col h-full bg-white border border-slate-200/70 rounded-sm overflow-hidden transition-all duration-200 hover:border-slate-300 hover:shadow-[0_8px_24px_-8px_rgba(15,37,87,0.12)]">
      {/* Portrait */}
      <div className="relative aspect-4/5 bg-slate-100 overflow-hidden">
        {profileImgUrl ? (
          <Image
            src={profileImgUrl}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            className="object-cover grayscale-15 group-hover:grayscale-0 transition-[filter,transform] duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <span className="font-serif text-5xl text-slate-300 tracking-tight">
              {getInitials(member.name) || <User className="w-12 h-12" />}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        <h3 className="font-serif text-lg md:text-[1.25rem] leading-snug text-slate-900 tracking-tight">
          {member.name}
        </h3>
        {member.designation && (
          <p className="mt-1 text-sm text-slate-500 italic leading-snug">
            {member.designation}
          </p>
        )}

        {member.researchAreas && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-amber-700 mb-2">
              Research
            </div>
            <div
              className="prose prose-sm max-w-none text-slate-600 leading-relaxed line-clamp-3 prose-p:my-0 prose-a:text-amber-700 prose-strong:text-slate-900"
              dangerouslySetInnerHTML={{ __html: member.researchAreas }}
            />
          </div>
        )}

        {/* Footer: contact links */}
        <div className="mt-auto pt-5 flex items-center gap-1 text-slate-400">
          {member.email && (
            <Link
              href={`mailto:${member.email}`}
              aria-label={`Email ${member.name}`}
              title={member.email}
              className="p-2 -ml-2 rounded-sm hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Mail className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          )}
          {member.phoneNumber && (
            <Link
              href={`tel:${member.phoneNumber}`}
              aria-label={`Call ${member.name}`}
              title={member.phoneNumber}
              className="p-2 rounded-sm hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Phone className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          )}
          {member.profileLink && (
            <Link
              href={member.profileLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${member.name}'s full profile`}
              className="p-2 rounded-sm hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

export default PublicGroupMemberCard;
