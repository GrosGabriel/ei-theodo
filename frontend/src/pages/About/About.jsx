import centraleLogo from '../../../public/Ecole_Centrale_Supelec.svg';
import './About.css';

function About() {
  return (
    <div className="about">
      <h1>À propos du projet</h1>
      <p className="about-description">
        Ce site a été réalisé dans le cadre du ST4 EI n°3 à CentraleSupélec. Il permet de rechercher, filtrer et noter des films, tout en mettant en avant l'expérience utilisateur et le travail collaboratif de notre équipe.
      </p>
      <h2>Notre équipe</h2>
      <div className="about-team">
        <div className="about-member">
          <img
            className="about-photo"
            src="/gros.jpeg"
            alt="Gabriel Gros"
          />
          <div className="about-info">
            <h3>Gabriel Gros</h3>
            <a href="https://www.linkedin.com/in/gabrielgroslink" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <p>
              
            </p>
          </div>
        </div>
        <div className="about-member">
          <img
            className="about-photo"
            src="/lechoux.jpeg"
            alt="Gaetan Lechoux"
          />
          <div className="about-info">
            <h3>Gaetan Lechoux</h3>
            <a href="https://www.linkedin.com/in/ga%C3%ABtan-lechoux-7a4748333/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <p>
             
            </p>
          </div>
        </div>
        <div className="about-member">
          <img
            className="about-photo"
            src="/foucaud.jpeg"
            alt="Romain Foucaud"
          />
          <div className="about-info">
            <h3>Romain Foucaud</h3>
            <a href="https://www.linkedin.com/in/romain-foucaud" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <p>
             
            </p>
          </div>
        </div>
      </div>

      <h2>Nos encadrants</h2>
      <div className="about-team">
        <div className="about-member">
          <img
            className="about-photo"
            src="/eudes.jpeg"
            alt="Thomas Eudes"
          />
          <div className="about-info">
            <h3>Thomas Eudes</h3>
            <a href="https://www.linkedin.com/in/thomas-eudes-4a326a173/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
        <div className="about-member">
          <img
            className="about-photo"
            src="/bentounes.jpeg"
            alt="Rayann Bentounes"
          />
          <div className="about-info">
            <h3>Rayann Bentounes</h3>
            <a href="https://www.linkedin.com/in/rayann-bentounes/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
        <div className="about-member">
          <img
            className="about-photo"
            src="/ouerdane.jpeg"
            alt="Wassila Ouerdane"
          />
          <div className="about-info">
            <h3>Wassila Ouerdane</h3>
            <a href="https://www.linkedin.com/in/wassila-ouerdane-2362932b/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="about-thanks">
        <p>
          Un grand merci à nos encadrants et à notre professeure Wassila Ouerdane pour leur accompagnement, leurs conseils et leur disponibilité tout au long du projet.
        </p>
      </div>
      <div className="about-footer">
        <div className="logo-noms">
          <div className="logo">
            <img src={centraleLogo} alt="Ecole_Centrale_Supelec.svp" className="centrale-logo" />
          </div>
        </div>
        <p>
          CentraleSupélec, ST4 EI n°3<br />
        </p>
      </div>
    </div>
  );
}

export default About;
