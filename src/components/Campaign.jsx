import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Heading from './Heading';

export default function Campaign() {
  const [campaigns, setCampaigns] = useState(null);
  // const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('https://api.vcommission.com/v2/publisher/campaigns?apiKey=65758e75e244fcdefe79ff5ec7665758e75e2476');
        const responseData = await response.json();

        const simplifiedCampaigns = responseData.data.campaigns.map(campaign => ({
          id: campaign.id,
          preview_url: campaign.preview_url,
          title: campaign.title,
          previewUrl: campaign.thumbnail,
          category: campaign.categories,
          discription: campaign.description,
          trackingUrl: campaign.tracking_link
        }));
        setCampaigns(simplifiedCampaigns);
        // setVisibleItems(simplifiedCampaigns.slice(0, 10));
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };
    fetchCampaigns();
  }, [])


  const extractTextFromHtml = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent;
  };
  const uniqueTitles = new Set();

  return (
    <Container id="campaignSection">
      <Heading heading="Our Varified Campaign For You" />
      {campaigns ? (
        <Container>
          <ul className="campaign-List">
            {campaigns.map(campaign => {
              const campaignText = campaign.discription;
              const extractedDescription = extractTextFromHtml(campaignText);

              const paragraph = extractedDescription;
              const descriptionIndex = paragraph.indexOf("Description:");
              const conversionFlowIndex = paragraph.indexOf("Conversion Flow:");
              const specificPart = paragraph.substring(descriptionIndex, conversionFlowIndex).trim();


              const title = campaign.title.split('.');
              const specificTitle = title[0]

              if (uniqueTitles.has(specificTitle)) {
                return null;
              }

              uniqueTitles.add(specificTitle)
              return (
                <li key={campaign.id}>
                  <Container className="py-3 mb-4">
                    <Row className="align-items-center">
                      <Col className="col-md-2"><a type="button" href={campaign.trackingUrl} target="_blank"><img src={campaign.previewUrl} alt={campaign.title} className="campaignImage" /></a></Col>
                      <Col className="col-md-3"><a type="button" href={campaign.trackingUrl} target="_blank">  <h3 className="title">{specificTitle}</h3> </a><p className="category">Category : {campaign.category}</p></Col>
                      <Col className="col-md-5 mobile-description"> <p>{specificPart}</p></Col>
                      <Col className="col-md-2 text-center"> <a type="button" href={campaign.trackingUrl} target="_blank" className="c-button_white-slide-button c-button btn">Get Offer</a> {/* Render the extracted description */}</Col>
                    </Row>
                  </Container>
                </li>

              );
            })}
          </ul>

        </Container>) : (<p>Loading....</p>)}
    </Container>
  )
}
