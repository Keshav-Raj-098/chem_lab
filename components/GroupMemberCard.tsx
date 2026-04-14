import Image from "next/image";
import { Mail, ExternalLink, GraduationCap } from "lucide-react";
import Link from "next/link";

interface GroupMember {
  id: string;
  name: string;
  email: string;
  researchAreas: string;
  designation: string | null;
  category: string;
  profileImgUrl: string | null;
  profileLink: string | null;
}

const getFullImageUrl = (url: string | null) => {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("/")) return url;
  // If it's a relative path from Cloudinary, prepend the public URL.
  const publicUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
  return publicUrl ? `${publicUrl}/${url}` : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${url}`;
};

const GroupMemberCard = ({ member }: { member: GroupMember }) => {
  const profileImgUrl = getFullImageUrl(member.profileImgUrl);
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <div className="relative aspect-4/5 w-full overflow-hidden bg-gray-50">
        {profileImgUrl ? (
          <Image
            src={profileImgUrl}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
            <GraduationCap className="w-12 h-12 mb-2" />
            <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
          </div>
        )}
        
        {/* Overlay for category */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-blue-700 rounded-full shadow-sm uppercase tracking-wider border border-blue-50">
            {member.category.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
            {member.name}
          </h3>
          {member.designation && (
            <p className="text-sm font-medium text-blue-600/80">
              {member.designation}
            </p>
          )}
        </div>

        {member.researchAreas && (
          <div className="mb-6 flex-1 text-sm text-gray-600 line-clamp-3 overflow-hidden">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Research Focus</div>
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: member.researchAreas }} 
            />
          </div>
        )}

        <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
          <a
            href={`mailto:${member.email}`}
            className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-full"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
          {member.profileLink && (
            <Link
              href={member.profileLink}
              target="_blank"
              className="text-xs font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-1.5 group/link bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-all"
            >
              Learn More
              <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupMemberCard;
