import { AnnouncementMarquee } from "@/components/molecules/AnnouncementMarquee";
import { StandardHeader, type StandardHeaderProps } from "@/components/molecules/StandardHeader";

export type HeaderWithAnnouncementProps = StandardHeaderProps & {
  announcements?: string[];
};

/** Announcement ticker stacked above the classic left-nav header. Mockup ref: 1d. */
export function HeaderWithAnnouncement({ announcements, ...headerProps }: HeaderWithAnnouncementProps) {
  return (
    <div>
      <AnnouncementMarquee items={announcements} />
      <StandardHeader {...headerProps} />
    </div>
  );
}
