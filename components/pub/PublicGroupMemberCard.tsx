import Image from "next/image";
import { Mail, Phone, ExternalLink } from "lucide-react";
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
  return publicUrl
    ? `${publicUrl}/${url}`
    : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${url}`;
};

const PublicGroupMemberCard = ({ member }: { member: GroupMember }) => {
  const profileImgUrl = getFullImageUrl(member.profileImgUrl);
  // Reformat category to be more readable
  const displayCategory = member.category.replace(/_/g, " ");

  return (
    <div className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/75 hover:shadow-xl hover:border-teal-200/75 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden flex flex-col h-full group">
      
      {/* Link Overlay */}
      {member.profileLink && (
        <Link href={member.profileLink} target="_blank" className="absolute inset-0 z-10" aria-label={`View ${member.name}'s profile`} />
      )}

      <div className="flex flex-col gap-6 relative z-10 flex-1">
        <div className="flex items-start gap-4">
            {/* Avatar Container */}
            <div className="flex-shrink-0 relative w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/50 shadow-sm overflow-hidden group-hover:border-teal-200/50 transition-colors">
                {profileImgUrl ? (
                    <Image
                        src={profileImgUrl}
                        alt={member.name}
                        fill
                        sizes="64px"
                        loading="lazy"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                        <span className="font-extrabold text-2xl text-slate-300">
                           {member.name.charAt(0)}
                        </span>
                    </div>
                )}
            </div>

            {/* Name & Badge */}
            <div className="flex flex-col flex-1 pt-1 justify-center">
                <span className="px-2.5 py-1 w-fit bg-teal-50 text-teal-700 text-[9px] font-bold uppercase tracking-widest rounded-full border border-teal-200/50 mb-1.5 shadow-sm">
                    {member.designation || displayCategory}
                </span>
                <h3 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-teal-700 transition-colors line-clamp-2">
                    {member.name}
                </h3>
            </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-500">
          {member.email && (
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/50 rounded-lg group-hover:border-teal-100 group-hover:bg-teal-50/50 transition-colors z-20 relative shadow-sm">
               <Mail className="w-3.5 h-3.5 text-teal-600" />
               <span className="truncate max-w-[150px]">{member.email}</span>
             </div>
          )}
          {member.phoneNumber && (
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200/50 rounded-lg group-hover:border-teal-100 group-hover:bg-teal-50/50 transition-colors z-20 relative shadow-sm">
               <Phone className="w-3.5 h-3.5 text-teal-600" />
               <span>{member.phoneNumber}</span>
             </div>
          )}
        </div>
        
        {/* Expertise / Body */}
        {member.researchAreas && (
          <div className="flex-1 flex flex-col pt-4 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
               Research Focus
            </span>
            <div 
              className="prose prose-sm max-w-none text-slate-600 font-medium leading-relaxed
                         prose-p:m-0 line-clamp-3 
                         group-hover:text-slate-800 transition-colors duration-300"
              dangerouslySetInnerHTML={{ __html: member.researchAreas }} 
            />
          </div>
        )}

      </div>

      {member.profileLink && (
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 z-20">
           <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-200/50 shadow-sm">
             <ExternalLink className="w-4 h-4" />
           </div>
        </div>
      )}
    </div>
  );
};

export default PublicGroupMemberCard;
