import React, { useState, useEffect } from 'react';
import Header2 from './../Common/Header2';
import Footer2 from './../Common/Footer2';
import Banner from './../Elements/Banner';
import SEO from './../Common/SEO';

const bannerImg = require('./../../images/banner/8.jpg');

const InfrioChoice = () => {
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [apiData3, setApiData3] = useState([]);
  const [flag, setFlag] = useState(true);
  const [currentPagePhotoIndex, setCurrentPagePhotoIndex] = useState(0);
  const [currentSubCategoryName, setCurrentSubCategoryName] = useState('');

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const formdata = new FormData();
        formdata.append("id", 28); // Infrio Choice category ID

        const response = await fetch(
          "https://www.admin.infrioindia.com/api/v2/auth/project-category-services-details-get-main-category",
          {
            method: "POST",
            body: formdata,
          }
        );

        const result = await response.json();

        if (result.status) {
          setCategoryData(result.data);
          // If there are subcategories, show them; otherwise show direct photos
          if (result.data.allSubCategories && result.data.allSubCategories.length > 0) {
            setFlag(true);
          } else if (result.data.photos && result.data.photos.length > 0) {
            setApiData3(result.data.photos);
            setFlag(false);
            setCurrentSubCategoryName(result.data.category_name || '');
          }
        } else {
          setError(result.message || 'Failed to fetch category data');
        }
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  const openGalleryModal = (photos, startIndex = 0) => {
    setGalleryPhotos(photos);
    setCurrentPhotoIndex(startIndex);
    setShowGalleryModal(true);
  };

  const closeGalleryModal = () => {
    setShowGalleryModal(false);
    setGalleryPhotos([]);
    setCurrentPhotoIndex(0);
  };

  const goPrevPhoto = (e) => {
    e?.stopPropagation?.();
    setCurrentPhotoIndex((idx) => (idx - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  const goNextPhoto = (e) => {
    e?.stopPropagation?.();
    setCurrentPhotoIndex((idx) => (idx + 1) % galleryPhotos.length);
  };

  const goPrevPagePhoto = (e) => {
    e?.stopPropagation?.();
    setCurrentPagePhotoIndex((idx) => (idx - 1 + apiData3.length) % apiData3.length);
  };

  const goNextPagePhoto = (e) => {
    e?.stopPropagation?.();
    setCurrentPagePhotoIndex((idx) => (idx + 1) % apiData3.length);
  };

  const handleSubCategoryClick = (subCategory) => {
    // Open gallery modal with photos, similar to Projects2.jsx
    const photosArray = Array.isArray(subCategory?.photos) && subCategory.photos.length > 0
      ? subCategory.photos
      : (subCategory?.thumbnail_img ? [subCategory.thumbnail_img] : []);
    if (photosArray.length > 0) {
      openGalleryModal(photosArray, 0);
    }
  };

  // Reset page photo index when apiData3 changes
  useEffect(() => {
    if (apiData3.length > 0) {
      setCurrentPagePhotoIndex(0);
    }
  }, [apiData3]);

  return (
    <>
      <SEO
        titleExact
        title="Infrio Choice – Premium Design and Build Selections"
        description="Explore Infrio Choice – our curated collection of premium architecture, interior and design-build solutions. Discover expert-recommended concepts, materials and project ideas for homes and commercial spaces with a strong focus on quality and sustainable design."
        keywords="Infrio choice, premium architecture designs, curated interior design ideas, design and build solutions india, sustainable design solutions for homes, best architectural concepts for commercial projects, modern interior inspirations india, infrio featured projects, expert recommended design solutions, architecture and interior trends india"
        canonicalPath="/infrio-choice"
      />
      <Header2 />
      <div className="page-content">
        <Banner
          title="Infrio's Choice"
          pagename="Curated Selection"
          description={categoryData?.short_description || "A handpicked collection of spaces that reflect the essence of Infrio's design philosophy."}
          bgimage={bannerImg}
        />
        <div className="section-full p-t80 p-b80">
          <div className="container">
            {loading ? (
              <div className="text-center p-t50 p-b50">
                <p>Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center p-t50 p-b50">
                <p className="text-danger">{error}</p>
              </div>
            ) : categoryData ? (
              <>
                <div className="row align-items-center m-b50">
                  <div className="col-lg-6 col-md-12 m-b30">
                    {categoryData.thumbnail_img ? (
                      <img
                        src={categoryData.thumbnail_img}
                        alt={categoryData.category_name || "Infrio Choice Highlight"}
                        className="w-100 rounded"
                        style={{ objectFit: 'cover', minHeight: '320px', cursor: 'pointer' }}
                        loading="lazy"
                        onClick={() => {
                          if (categoryData.photos && categoryData.photos.length > 0) {
                            openGalleryModal(categoryData.photos, 0);
                          }
                        }}
                      />
                    ) : (
                      <div className="w-100 rounded bg-gray-light" style={{ minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p className="text-muted">No image available</p>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <h3 className="m-b20">{categoryData.category_name || "Spaces That Inspire"}</h3>
                    <p className="text-muted m-b20">
                      {categoryData.short_description || "Each Infrio Choice project is chosen for its unique blend of aesthetics, functionality, and innovation. We pick designs that redefine everyday living with thoughtful planning and bespoke detailing."}
                    </p>
                    <p className="text-muted">
                      Explore this curated selection to understand how we solve complex design challenges while delivering timeless experiences for our clients.
                    </p>
                  </div>
                </div>

                {flag === true && categoryData.allSubCategories && categoryData.allSubCategories.length > 0 ? (
                  <div className="row m-t50">
                    <div className="col-lg-12 m-b30">
                      <h3 className="m-b30">Gallery</h3>
                    </div>
                    {categoryData.allSubCategories.map((subCategory, index) => (
                      <div key={subCategory.id || index} className="col-lg-4 col-md-6 col-sm-12 m-b30">
                        <div className="sx-box bg-white border-radius-10 shadow-sm" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                          <div className="sx-thum-bx" style={{ width: "100%", height: "250px", overflow: "hidden" }}>
                            <img 
                              src={subCategory.thumbnail_img || (subCategory.photos && subCategory.photos[0])} 
                              alt={subCategory.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                          </div>
                          <div className="p-a20" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <h4 className="sx-tilte m-b15" style={{ color: '#333', fontSize: '1.1rem', fontWeight: 600 }}>{subCategory.name}</h4>
                            <button 
                              className="site-button btn-block" 
                              onClick={() => handleSubCategoryClick(subCategory)}
                              style={{ marginTop: 'auto' }}
                            >
                              <span>Click to Preview</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : flag === false && apiData3.length > 0 ? (
                  <div style={{
                    background: '#fff',
                    borderRadius: 10,
                    width: '100%',
                    height: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'visible',
                    position: 'relative',
                    padding: 'clamp(12px, 2.5vw, 20px)',
                    marginTop: 'clamp(30px, 5vw, 50px)',
                    marginBottom: 'clamp(15px, 3vw, 30px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {/* Category/Subcategory Name */}
                    {currentSubCategoryName && (
                      <div className="m-b20" style={{ textAlign: 'center', padding: 'clamp(8px, 2vw, 16px) 0' }}>
                        <h6 className="sx-tilte" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.3rem)', color: '#333', margin: 0, fontWeight: 500 }}>
                          {"Infrio's Choice"} → {currentSubCategoryName}
                        </h6>
                      </div>
                    )}
                    {/* Main image */}
                    {apiData3.length > 0 && (
                      <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: 'clamp(300px, 50vh, 500px)', maxHeight: 'clamp(300px, 50vh, 500px)', background: '#f5f5f5', borderRadius: 8, marginBottom: 'clamp(8px, 2vw, 14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img
                          src={apiData3[currentPagePhotoIndex]}
                          alt="gallery"
                          style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }}
                        />
                        {/* Nav arrows */}
                        {apiData3.length > 1 && (
                          <>
                            <button
                              onClick={goPrevPagePhoto}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: 'clamp(8px, 1.5vw, 12px)',
                                transform: 'translateY(-50%)',
                                background: '#333',
                                color: '#fff',
                                border: 'none',
                                padding: 'clamp(10px, 2vw, 14px)',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontSize: 'clamp(16px, 3vw, 20px)',
                                zIndex: 10,
                                width: 'clamp(36px, 7vw, 44px)',
                                height: 'clamp(36px, 7vw, 44px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }}
                            >
                              ‹
                            </button>
                            <button
                              onClick={goNextPagePhoto}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                right: 'clamp(8px, 1.5vw, 12px)',
                                transform: 'translateY(-50%)',
                                background: '#333',
                                color: '#fff',
                                border: 'none',
                                padding: 'clamp(10px, 2vw, 14px)',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontSize: 'clamp(16px, 3vw, 20px)',
                                zIndex: 10,
                                width: 'clamp(36px, 7vw, 44px)',
                                height: 'clamp(36px, 7vw, 44px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }}
                            >
                              ›
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {/* Thumbnails row with side arrows */}
                    {apiData3.length > 1 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'clamp(6px, 1.5vw, 10px)',
                        marginTop: 'clamp(8px, 2vw, 12px)',
                        background: 'transparent',
                        flexShrink: 0,
                        padding: '0',
                        width: '100%',
                        overflow: 'visible'
                      }}>
                        <button
                          onClick={goPrevPagePhoto}
                          aria-label="Previous"
                          style={{
                            background: '#333',
                            color: '#fff',
                            border: 'none',
                            padding: 'clamp(8px, 1.5vw, 12px)',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 'clamp(16px, 3vw, 20px)',
                            flexShrink: 0,
                            width: 'clamp(36px, 7vw, 44px)',
                            height: 'clamp(36px, 7vw, 44px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '36px'
                          }}
                        >
                          ‹
                        </button>
                        <div style={{
                          display: 'flex',
                          gap: 'clamp(8px, 2vw, 12px)',
                          flexWrap: 'nowrap',
                          overflowX: 'auto',
                          flex: 1,
                          padding: '4px 2px',
                          WebkitOverflowScrolling: 'touch',
                          scrollbarWidth: 'thin',
                          minWidth: 0,
                          overflowY: 'hidden'
                        }}>
                          {apiData3.map((p, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentPagePhotoIndex(i)}
                              style={{
                                border: i === currentPagePhotoIndex ? '2px solid #d7b39a' : '1px solid #ddd',
                                padding: 0,
                                background: '#fff',
                                cursor: 'pointer',
                                borderRadius: 6,
                                flex: '0 0 auto',
                                transition: 'border-color 0.2s',
                                overflow: 'hidden',
                                minWidth: 'clamp(70px, 14vw, 110px)',
                                minHeight: 'clamp(70px, 14vw, 110px)'
                              }}
                              aria-label={`Photo ${i + 1}`}
                            >
                              <img
                                src={p}
                                alt="thumb"
                                style={{
                                  width: 'clamp(70px, 14vw, 110px)',
                                  height: 'clamp(70px, 14vw, 110px)',
                                  objectFit: 'cover',
                                  display: 'block',
                                  borderRadius: 5
                                }}
                              />
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={goNextPagePhoto}
                          aria-label="Next"
                          style={{
                            background: '#333',
                            color: '#fff',
                            border: 'none',
                            padding: 'clamp(8px, 1.5vw, 12px)',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 'clamp(16px, 3vw, 20px)',
                            flexShrink: 0,
                            width: 'clamp(36px, 7vw, 44px)',
                            height: 'clamp(36px, 7vw, 44px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '36px'
                          }}
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </div>
                ) : categoryData.photos && categoryData.photos.length > 0 ? (
                  <div className="row m-t50">
                    <div className="col-lg-12 m-b30">
                      <h3 className="m-b30">Gallery</h3>
                    </div>
                    {categoryData.photos.map((photo, index) => (
                      <div key={index} className="col-lg-4 col-md-6 col-sm-12 m-b30">
                        <div 
                          className="sx-box image-hover-block" 
                          onClick={() => openGalleryModal(categoryData.photos, index)} 
                          style={{ cursor: 'pointer', height: '100%' }}
                        >
                          <div className="sx-thum-bx" style={{ width: '100%', height: '300px', overflow: 'hidden' }}>
                            <img 
                              src={photo} 
                              alt={`${categoryData.category_name} - Image ${index + 1}`}
                              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>
      <Footer2 />

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div
          className="modal-overlay"
          onClick={closeGalleryModal}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.6)', zIndex: 2000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'clamp(8px, 2vw, 16px)'
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(48, 47, 47, 0.9)', borderRadius: 10,
              width: 'min(96vw, 1000px)',
              height: 'min(92vh, 720px)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden', position: 'relative',
              padding: 'clamp(12px, 2.5vw, 20px)'
            }}
          >
            {/* Close */}
            <button
              onClick={closeGalleryModal}
              // style={{ position: 'absolute', top: 'clamp(6px, 1.5vw, 10px)', right: 'clamp(6px, 1.5vw, 10px)', background: 'transparent', color: '#fff', border: 'none', fontSize: 'clamp(18px, 3.5vw, 22px)', cursor: 'pointer', lineHeight: 1 }}
              style={{ 
                position: 'absolute', 
                top: 'clamp(8px, 2vw, 12px)', 
                right: 'clamp(8px, 2vw, 12px)', 
                background: 'rgba(0, 0, 0, 0.6)', 
                color: '#fff', 
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                width: 'clamp(40px, 8vw, 48px)',
                height: 'clamp(40px, 8vw, 48px)',
                minWidth: '40px',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(20px, 4vw, 24px)',
                cursor: 'pointer',
                lineHeight: 1,
                zIndex: 1000,
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.8)';
                e.target.style.transform = 'scale(1.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                e.target.style.transform = 'scale(1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
              aria-label="Close"
            >
              ✖
            </button>

            {/* Main image */}
            {galleryPhotos.length > 0 && (
              <div style={{ position: 'relative', width: '100%', flex: 1, minHeight: 0, background:'transparent', borderRadius: 8 }}>
                <img
                  src={galleryPhotos[currentPhotoIndex]}
                  alt="gallery"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                />
                {/* Nav arrows */}
                {galleryPhotos.length > 1 && (
                  <>
                    <button onClick={goPrevPhoto} style={{ position: 'absolute', top: '50%', left: 'clamp(6px, 1.5vw, 12px)', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.18)', color: '#fff', border: 'none', padding: 'clamp(6px, 1.5vw, 10px) clamp(8px, 2vw, 12px)', borderRadius: 6, cursor: 'pointer', fontSize: 'clamp(16px, 3vw, 20px)' }}>&lt;</button>
                    <button onClick={goNextPhoto} style={{ position: 'absolute', top: '50%', right: 'clamp(6px, 1.5vw, 12px)', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.18)', color: '#fff', border: 'none', padding: 'clamp(6px, 1.5vw, 10px) clamp(8px, 2vw, 12px)', borderRadius: 6, cursor: 'pointer', fontSize: 'clamp(16px, 3vw, 20px)' }}>&gt;</button>
                  </>
                )}
              </div>
            )}

            {/* Thumbnails row with side arrows */}
            {galleryPhotos.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(6px, 1.5vw, 10px)', marginTop: 'clamp(8px, 2vw, 14px)' ,background:'transparent', flexShrink: 0 }}>
                <button
                  onClick={goPrevPhoto}
                  aria-label="Previous"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', padding: 'clamp(6px, 1.5vw, 10px) clamp(8px, 2vw, 12px)', borderRadius: 6, cursor: 'pointer', fontSize: 'clamp(16px, 3vw, 20px)' }}
                >
                  ‹
                </button>
                <div style={{ display: 'flex', gap: 'clamp(6px, 1.5vw, 10px)', flexWrap: 'nowrap', overflowX: 'auto', maxWidth: '80vw', padding: '4px 2px' }}>
                  {galleryPhotos.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPhotoIndex(i)}
                      style={{
                        border: i === currentPhotoIndex ? '2px solid #d7b39a' : '1px solid #333',
                        padding: 0, background: 'transparent', cursor: 'pointer', borderRadius: 6, flex: '0 0 auto'
                      }}
                      aria-label={`Photo ${i + 1}`}
                    >
                      <img src={p} alt="thumb" style={{ width: 'clamp(48px, 9vw, 72px)', height: 'clamp(48px, 9vw, 72px)', objectFit: 'cover', display: 'block', borderRadius: 6 }} />
                    </button>
                  ))}
                </div>
                <button
                  onClick={goNextPhoto}
                  aria-label="Next"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', padding: 'clamp(6px, 1.5vw, 10px) clamp(8px, 2vw, 12px)', borderRadius: 6, cursor: 'pointer', fontSize: 'clamp(16px, 3vw, 20px)' }}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InfrioChoice;
