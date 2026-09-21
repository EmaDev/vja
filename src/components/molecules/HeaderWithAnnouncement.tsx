import { AnnouncementMarquee } from "@/components/molecules/AnnouncementMarquee";
import { StandardHeader } from "@/components/molecules/StandardHeader";

/** Announcement ticker stacked above the classic left-nav header. Mockup ref: 1d. */
export function HeaderWithAnnouncement() {
  return (
    <div>
      <AnnouncementMarquee />
      <StandardHeader />
    </div>
  );
}
