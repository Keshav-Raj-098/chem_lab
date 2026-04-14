import Image from "next/image";
import { Mail, GraduationCap, Phone, User2 } from "lucide-react";
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
  phoneNumber: string | null;
}

const getFullImageUrl = (url: string | null) => {
  if (!url) return null;
  if (url.startsWith("http") || url.startsWith("/")) return url;
  const publicUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
  return publicUrl ? `${publicUrl}/${url}` : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${url}`;
};

const PublicGroupMemberCard = ({ member }: { member: GroupMember }) => {
  const profileImgUrl = getFullImageUrl(member.profileImgUrl);

  return (
    <div 
      className="group relative bg-white rounded-2xl p-6 transition-all duration-500 border border-slate-100 flex flex-col items-center text-center h-full hover:-translate-y-2 overflow-hidden"
      style={{
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(15, 37, 87, 0.1), 0 10px 10px -5px rgba(15, 37, 87, 0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)";
      }}
    >
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-150" />
      
      {/* Image Container - Professional & Compact */}
      <div className="relative mb-5 pt-1">
        <div 
          className="relative w-24 h-24 rounded-2xl p-1 bg-white ring-1 ring-slate-100 transition-all duration-700 group-hover:ring-[#0d9488]/30 group-hover:-rotate-2"
          style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-50">
            {profileImgUrl ? (
              <Image
                src={profileImgUrl}
                alt={member.name}
                fill
                sizes="96px"
                loading="lazy"
                className="object-cover transition-all duration-1000 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                <GraduationCap className="w-10 h-10" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col w-full">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#0f2557] mb-1 group-hover:text-[#0d9488] transition-colors leading-tight">
            {member.name}
          </h3>
          {member.designation && (
            <p className="text-[13px] font-medium text-slate-500/90 italic">
              {member.designation}
            </p>
          )}
        </div>

        {/* Expertise - Clean & Minimal */}
        {member.researchAreas && (
          <div className="mb-5 flex-1 px-2">
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Research Area</div>
            <div 
              className="text-sm text-slate-600 line-clamp-2 prose prose-sm max-w-none leading-relaxed italic"
              dangerouslySetInnerHTML={{ __html: member.researchAreas }} 
            />
          </div>
        )}

        {/* Contact & Category Row */}
        <div className="w-full space-y-4 pt-4 border-t border-slate-50">
          <div className="grid grid-cols-2 gap-2 text-left">
             <div className="px-2 py-1.5 bg-slate-50/50 rounded-lg text-slate-600 border border-slate-100 flex items-center gap-2 overflow-hidden">
                <Mail className="w-3 h-3 text-[#0d9488] shrink-0" />
                <span className="text-[9px] font-medium truncate" title={member.email}>{member.email}</span>
             </div>
             {member.phoneNumber && (
               <div className="px-2 py-1.5 bg-slate-50/50 rounded-lg text-slate-600 border border-slate-100 flex items-center gap-2 overflow-hidden">
                  <Phone className="w-3 h-3 text-[#0d9488] shrink-0" />
                  <span className="text-[9px] font-medium truncate" title={member.phoneNumber}>{member.phoneNumber}</span>
               </div>
             )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="px-3 py-1.5 bg-teal-50 text-[#0d9488] rounded-full text-[10px] font-bold uppercase tracking-wider border border-teal-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488] animate-pulse" />
                {member.category.replace("_", " ")}
            </span>

            {member.profileLink && (
              <Link
                href={member.profileLink}
                target="_blank"
                className="flex items-center justify-center p-2.5 bg-[#0f2557] hover:bg-[#0d9488] text-white rounded-xl transition-all duration-300 group/btn shadow-md hover:shadow-teal-100"
                title="View Full Profile"
              >
                <User2 className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicGroupMemberCard;
