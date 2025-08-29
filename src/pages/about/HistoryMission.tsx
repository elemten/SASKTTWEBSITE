import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";

const HistoryMission = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">History & Mission</h1>

      <div className="grid gap-10">
        <section>
          <h2 className="text-2xl font-semibold mb-3">The Birth of the Saskatchewan Table Tennis Association</h2>
          <p className="text-muted-foreground mb-4">
            The Saskatchewan Table Tennis Association (STTA) was formed in 1970 so
            Saskatchewan athletes could take part in the 1971 Canada Winter Games. The
            STTA was officially incorporated as a Society on April 18, 1975 with the
            original office at 114 Sunset Drive in Regina. The object of the society
            in 1975: “To promote the sport of table tennis in Saskatchewan and to
            provide the utmost in opportunities to all its members to participate in
            the sport of table tennis as much as possible.” The first President of the
            STTA was Robert Vos with Taka Kinose as a director and also as the first
            provincial coach. Other board members upon incorporation were Neil
            Samoluk, Bob Lucky, Simon Wong and Lorne Cherry.
          </p>
          <p className="text-muted-foreground mb-4">
            In 1976, the second year of operation of the STTA, Ron Wayow was elected
            as President, with the following people as the executive; Zig Lejins, Vice
            President, Robert Galenzoski, Secretary, Taka Kinose, Treasurer. Directors
            included Neil Samoluk, Robert Vos, Saithe James, Bob Lucky and Jack
            Chiang. Dave Coleman was introduced to the STTA as the first table tennis
            Technical Director.
          </p>
          <p className="text-muted-foreground mb-4">
            In 1979 Bob Galenzoski was elected President of the STTA and carried into
            1980 where the first Multi‑year plan was implemented along with the hiring
            of an Executive Director for the Association. In 1981 STTA made its first
            application to Sask Sport for money to fund the Executive Director position
            and was granted $13,200.00; the position would be responsible “for the
            administrating its policies and programs and to raise the necessary funds
            needed to carry out these programs”. The Executive Director for the new
            STTA Inc. was Dave Coleman.
          </p>
          <p className="text-muted-foreground mb-4">
            Also in 1981 the STTA applied to be fully incorporated and on November 17th,
            1981 the Saskatchewan Table Tennis Association Incorporated was formed.
            Leading the new Board of Directors was President Kotrappa Hampole and the
            first set of Directors of the STTA Inc. including Harold Glowa, Henry J.
            Marcotte, Murray G. Sproule, Erwin Engel, Robert F. Galenzoski, Edward
            Hung, Robert Pilon and Allan Romanosky. In the late eighties the office was
            moved to Saskatoon at 510 Cynthia Street.
          </p>
          <p className="text-muted-foreground">
            Dave Coleman continued to run the Association as the Executive Director and
            also Provincial Coach until 1985. In 1987 Christian Lillieroos was hired as
            the Provincial Coach while the Executive Director position remained vacant
            until 1987 when Steve Taylor was hired to run the STTA office. From 1999 to
            2002, Robert Pilan acted as Executive Director, followed by Dwayne Yachiw
            from 2002 to 2009 and again from 2010 to 2015 and finally Jeff Woo from 2016
            to 2021. We have been fortunate to have a diverse and experienced Board and
            staff throughout the years whose hard work and dedication have grown the
            sport of table tennis and supported our athletes in the province of
            Saskatchewan. We look forward to many years ahead!
          </p>
          <p className="text-xs text-muted-foreground mt-2">Image by Katherine Drake</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Vision Statement</h2>
          <p className="text-muted-foreground">
            Table Tennis Saskatchewan's (TTSask) vision is to develop players in the
            sport of table tennis and to create healthy competition amongst athletes
            for the opportunity to represent TTSask and Saskatchewan at all major
            Provincial, National, International and Olympic competitions. TTSask will
            maintain a strong participation network to help supply high‑level athletes
            to the provincial team.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Mission Statement (1981)</h2>
          <p className="text-muted-foreground">
            TTSask’s purpose is to promote and increase the knowledge, skill and
            proficiency of its members in all things relating to table tennis.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Strategic Objectives</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Canadian Sport 4 Life (CS4L) and Canada's Long Term Athlete Development (LTAD) framework</li>
            <li>Aboriginal Sport Development</li>
            <li>Women in Sport, Physical Activity and Recreation</li>
            <li>Coach and Officials Development</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Values</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>We value the purity of the sport of table tennis.</li>
            <li>We value and support the achievements of Saskatchewan athletes to the highest possible level.</li>
            <li>We value table tennis’s inherent ability to develop individuals physically, socially and emotionally through TTCan LTAD/Sport4Life.</li>
            <li>We value the TTSask team that includes volunteers, parents, coaches, officials and staff.</li>
            <li>We value TTSask’s club structure.</li>
            <li>We value the accessibility of table tennis regardless of an individual’s physical size, gender, economic situation or geographic location.</li>
          </ul>
        </section>

        <section>
          <a href="/membership" className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 w-fit">
            Donate / Join Now
          </a>
        </section>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default HistoryMission;


