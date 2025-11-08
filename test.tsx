import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Mock data - replace with your actual data source
const propertiesData = {
  QuezonCity: {
    name: 'Quezon City Property',
    address: 'Holy Spirit, Quezon City',
    description: 'Premium apartments in Quezon City',
    mapEmbed:
      "<iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3857.0!2d121.0!3d14.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDM2JzAwLjAiTiAxMjHCsDAwJzAwLjAiRQ!5e0!3m2!1sen!2sph!4v1234567890123!5m2!1sen!2sph' width='100%' height='300' style='border:0;' allowfullscreen='' loading='lazy'></iframe>",
    rooms: [],
  },
  Pampanga: {
    name: 'Pampanga Property',
    address: 'San Roque Dau, Pampanga',
    description: 'Modern apartments in Pampanga',
    mapEmbed:
      "<iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3857.0!2d120.6!3d15.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDA2JzAwLjAiTiAxMjDCsDM2JzAwLjAiRQ!5e0!3m2!1sen!2sph!4v1234567890123!5m2!1sen!2sph' width='100%' height='300' style='border:0;' allowfullscreen='' loading='lazy'></iframe>",
    rooms: [],
  },
};

function PropertyTabs() {
  const [activeTab, setActiveTab] =
    useState<keyof typeof propertiesData>('QuezonCity');
  const property = propertiesData[activeTab];

  return (
    <section className="w-full bg-[#F9F9FB] py-20 flex flex-col items-center">
      <div className="mb-4">
        <span className="inline-block bg-white rounded-full px-4 py-1 text-[#18181B] font-semibold shadow">
          Featured Properties
        </span>
      </div>
      <h2 className="text-4xl font-bold text-[#18181B] mb-4 text-center">
        Discover Your Perfect Home
      </h2>
      <p className="text-xl text-[#6B7280] mb-8 text-center max-w-2xl">
        Explore our carefully curated selection of premium apartments across New
        York's most desirable neighborhoods, each offering unique amenities and
        stunning views.
      </p>
      {/* Tabs */}
      <div className="flex gap-4 mb-8 justify-center">
        {Object.keys(propertiesData).map((tab) => (
          <button
            key={tab}
            className={`px-8 py-4 rounded-2xl font-semibold text-lg focus:outline-none transition ${
              activeTab === tab
                ? 'bg-[#18181B] text-white shadow'
                : 'bg-white text-[#18181B] hover:bg-[#F3F4F6]'
            }`}
            onClick={() => setActiveTab(tab as keyof typeof propertiesData)}
          >
            {tab}
            <div className="text-sm font-normal mt-1 text-[#6B7280]">
              {tab === 'QuezonCity' && 'Holy Spirit'}
              {tab === 'Pampanga' && 'San Roque Dau'}
            </div>
          </button>
        ))}
      </div>
      {/* Property Info */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-[#18181B] mb-2">
              {property.name}
            </h3>
            <div className="flex items-center gap-2 text-[#6B7280] mb-2">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="#6B7280"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M17 10.5V7a5 5 0 0 0-10 0v3.5" />
                <path d="M12 17v2" />
                <circle cx="12" cy="14" r="3" />
                <path d="M12 17v2" />
              </svg>
              {property.address}
            </div>
            <div className="text-[#6B7280]">{property.description}</div>
          </div>
        </div>

        {/* Embedded Map */}
        <div
          className="w-full rounded-xl overflow-hidden mb-8"
          dangerouslySetInnerHTML={{ __html: property.mapEmbed }}
        />

        {/* Rooms */}
        <div className="flex flex-col md:flex-row gap-8">
          {property.rooms.map((room, idx) => (
            <div
              key={idx}
              className="flex-1 bg-white rounded-2xl shadow p-0 overflow-hidden flex flex-col"
            >
              <div className="relative">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-56 object-cover"
                />
                <span
                  className={`absolute top-4 left-4 px-4 py-1 rounded-full text-xs font-semibold ${room.status === 'Available Now' ? 'bg-[#18181B] text-white' : 'bg-[#F3F4F6] text-[#18181B]'}`}
                >
                  {room.status}
                </span>
                <span className="absolute top-4 right-4 bg-white rounded-full p-2 shadow">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="#18181B"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-lg text-[#18181B]">
                    {room.title}
                  </h4>
                  <span className="font-bold text-2xl text-[#18181B]">
                    {room.price}
                    <span className="text-base font-normal text-[#6B7280]">
                      /month
                    </span>
                  </span>
                </div>
                <div className="flex gap-4 text-[#6B7280] text-sm mb-2">
                  <span className="flex items-center gap-1">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="#6B7280"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="7" width="18" height="10" rx="2" />
                      <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2" />
                    </svg>
                    {room.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="#6B7280"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 7v10" />
                      <path d="M17 7v10" />
                      <rect x="3" y="7" width="18" height="10" rx="2" />
                    </svg>
                    {room.beds}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="#6B7280"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v2" />
                      <path d="M12 20v2" />
                      <path d="M4.93 4.93l1.41 1.41" />
                      <path d="M17.66 17.66l1.41 1.41" />
                      <path d="M2 12h2" />
                      <path d="M20 12h2" />
                      <path d="M4.93 19.07l1.41-1.41" />
                      <path d="M17.66 6.34l1.41-1.41" />
                    </svg>
                    {room.baths}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="#6B7280"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                    {room.size}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-[#F3F4F6] text-[#18181B] px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Button
                  className={`mt-auto px-6 py-3 rounded-lg font-semibold text-lg ${room.buttonDisabled ? 'bg-[#A1A1AA] text-white cursor-not-allowed' : 'bg-[#18181B] text-white hover:bg-[#23272F]'}`}
                  disabled={room.buttonDisabled}
                >
                  {room.button}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
