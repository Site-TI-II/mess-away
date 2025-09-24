// Importação dos componentes modularizados da landing page
import { Box } from '@mui/material'
import HeroSection from './components/HeroSection'
import ProblemSection from './components/ProblemSection'
import AudienceSection from './components/AudienceSection'
import BenefitsSection from './components/BenefitsSection'
import ImpactSection from './components/ImpactSection'
import CtaSection from './components/CtaSection'

/**
 * Componente Home - Landing Page principal do Mess Away
 * 
 * Estrutura Modularizada:
 * 1. HeroSection - Apresentação principal com CTAs
 * 2. ProblemSection - Cards explicando dores do usuário
 * 3. AudienceSection - Personas/target audience
 * 4. BenefitsSection - Benefícios da solução
 * 5. PricingSection - Versões gratuita e premium
 * 6. ImpactSection - Benefícios para sociedade
 * 7. CtaSection - Chamada final para download
 * 
 * Cada seção é um componente independente com suas próprias
 * responsabilidades, facilitando manutenção e reutilização.
 */
function Home() {
  return (
    <Box>
      <HeroSection />
      <ProblemSection />
      <AudienceSection />
      <BenefitsSection />
      <ImpactSection />
      <CtaSection />
    </Box>
  )
}

export default Home