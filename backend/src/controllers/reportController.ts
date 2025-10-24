import { Response } from 'express';
import PDFDocument from 'pdfkit';
import pool from '../database/connection';
import { AuthRequest } from '../middleware/auth';
import axios from 'axios';

const createComprehensiveAnalysis = (product: any, answers: any[]) => {
  const analysis = {
    totalDataPoints: answers.length,
    productCategory: product.category,
    companyName: product.company,
    submissionDate: product.created_at,
    reportDate: new Date(),

    safetyRelated: 0,
    complianceRelated: 0,
    qualityRelated: 0,
    environmentalRelated: 0,
    technicalRelated: 0,

    questionTypes: {} as Record<string, number>,
    keyFindings: [] as string[],
    completenessScore: 0,
    riskLevel: 'Low' as 'Low' | 'Medium' | 'High'
  };

  answers.forEach(answer => {
    const questionText = answer.question_text.toLowerCase();

    if (questionText.includes('safety') || questionText.includes('allergen') ||
      questionText.includes('hazard') || questionText.includes('risk') ||
      questionText.includes('health') || questionText.includes('toxic')) {
      analysis.safetyRelated++;
    }

    if (questionText.includes('certification') || questionText.includes('compliance') ||
      questionText.includes('standard') || questionText.includes('regulation') ||
      questionText.includes('approved') || questionText.includes('license')) {
      analysis.complianceRelated++;
    }

    if (questionText.includes('quality') || questionText.includes('grade') ||
      questionText.includes('specification') || questionText.includes('ingredient') ||
      questionText.includes('material') || questionText.includes('composition')) {
      analysis.qualityRelated++;
    }

    if (questionText.includes('environment') || questionText.includes('sustainable') ||
      questionText.includes('recyclable') || questionText.includes('organic') ||
      questionText.includes('eco') || questionText.includes('carbon')) {
      analysis.environmentalRelated++;
    }

    if (questionText.includes('technical') || questionText.includes('specification') ||
      questionText.includes('performance') || questionText.includes('feature') ||
      questionText.includes('capacity') || questionText.includes('efficiency')) {
      analysis.technicalRelated++;
    }

    const type = answer.type || 'text';
    analysis.questionTypes[type] = (analysis.questionTypes[type] || 0) + 1;
  });

  const expectedQuestions = {
    'food': 15,
    'electronics': 12,
    'clothing': 10,
    'cosmetics': 12,
    'non-food': 10
  };

  const expected = expectedQuestions[product.category as keyof typeof expectedQuestions] || 10;
  analysis.completenessScore = Math.min(100, (answers.length / expected) * 100);

  if (analysis.completenessScore < 50) {
    analysis.riskLevel = 'High';
  } else if (analysis.completenessScore < 80) {
    analysis.riskLevel = 'Medium';
  } else {
    analysis.riskLevel = 'Low';
  }

  return analysis;
};

const generateAIReportContent = async (product: any, answers: any[], analysis: any) => {
  try {
    const aiServiceUrl = process.env.AI_SERVICE_URL;


    const response = await axios.post(`${aiServiceUrl}/generate-report-content`, {
      product,
      answers,
      analysis
    }, {
      timeout: 30000
    });

    return response.data.reportContent;
  } catch (error) {
    console.error('Error calling AI service:', error);

    const hasData = analysis.totalDataPoints > 0;
    const dataDescription = hasData
      ? `${analysis.totalDataPoints} documented data points`
      : 'initial product information';

    const completenessDescription = hasData
      ? `${analysis.completenessScore.toFixed(1)}% completeness score`
      : 'baseline documentation';

    const keyFindings = [];
    if (hasData) {
      keyFindings.push(`Product documentation includes ${analysis.totalDataPoints} data points`);
      if (analysis.safetyRelated > 0) {
        keyFindings.push(`Safety and health information: ${analysis.safetyRelated} documented items`);
      }
      if (analysis.complianceRelated > 0) {
        keyFindings.push(`Regulatory compliance: ${analysis.complianceRelated} compliance-related documents`);
      }
      if (analysis.qualityRelated > 0) {
        keyFindings.push(`Quality specifications: ${analysis.qualityRelated} quality-related data points`);
      }
      if (analysis.environmentalRelated > 0) {
        keyFindings.push(`Environmental considerations: ${analysis.environmentalRelated} items documented`);
      }
      if (analysis.technicalRelated > 0) {
        keyFindings.push(`Technical specifications: ${analysis.technicalRelated} technical details provided`);
      }
    }

    return {
      leadershipMessage: `At ${product.company}, we are committed to transparency and building trust with our stakeholders. This report for ${product.name} demonstrates our dedication to providing complete product information. With ${dataDescription} and ${completenessDescription}, we continue to set high standards for product transparency in the ${product.category} industry.`,

      executiveSummary: hasData
        ? `This transparency report provides comprehensive analysis of ${product.name}, manufactured by ${product.company}. The assessment covers ${analysis.totalDataPoints} documented data points with a completeness score of ${analysis.completenessScore.toFixed(1)}%. This documentation supports informed decision-making and regulatory compliance while demonstrating our commitment to product transparency.`
        : `This transparency report documents ${product.name}, manufactured by ${product.company}. The product has been registered in our transparency portal with basic information collected.`,

      transparencyAnalysis: hasData
        ? `The transparency assessment reveals a comprehensive documentation approach with ${analysis.totalDataPoints} total data points collected across multiple categories. The ${analysis.completenessScore.toFixed(1)}% completeness score indicates ${analysis.completenessScore > 80 ? 'excellent' : analysis.completenessScore > 60 ? 'good' : 'adequate'} transparency coverage for this ${product.category} product.`
        : `This transparency assessment establishes the baseline documentation for ${product.name} in the ${product.category} category.`,

      keyFindings,

      complianceAssessment: hasData
        ? `The compliance assessment demonstrates ${product.company}'s adherence to transparency standards with documented compliance information. The product meets documentation requirements for the ${product.category} category with coverage across safety, quality, and regulatory aspects.`
        : `The compliance assessment establishes ${product.company}'s commitment to transparency standards for ${product.name}.`,

      qualityAssessment: hasData && analysis.qualityRelated > 0
        ? `Quality specifications have been documented across ${analysis.qualityRelated} data points. The quality assessment covers material specifications, manufacturing processes, and quality control measures implemented by ${product.company}.`
        : '',

      conclusions: `This transparency assessment confirms ${product.company}'s commitment to product documentation for ${product.name}. The ${completenessDescription} and ${analysis.riskLevel.toLowerCase()} risk assessment demonstrate ${hasData ? 'effective' : 'foundational'} transparency practices.`,

      recommendations: [
        'Continue maintaining comprehensive documentation standards across all product categories',
        'Implement regular transparency assessments to ensure ongoing compliance',
        'Enhance stakeholder access to product transparency information',
        'Monitor regulatory requirements and update documentation practices accordingly'
      ]
    };
  }
};

class PDFReportGenerator {
  private doc: PDFKit.PDFDocument;
  private currentY: number = 60;
  private pageNumber: number = 1;
  private readonly margin = 60;
  private readonly contentWidth: number;

  constructor() {
    this.doc = new PDFDocument({
      margin: this.margin,
      size: 'A4',
      bufferPages: true
    });
    this.contentWidth = this.doc.page.width - (this.margin * 2);
  }

  private addHeader(title: string, level: number = 1): void {
    const fontSize = level === 1 ? 18 : level === 2 ? 14 : 12;

    this.doc.fontSize(fontSize).fillColor('#000000').font('Helvetica-Bold')
      .text(title, this.margin, this.currentY);

    if (level === 1) {
      this.doc.moveTo(this.margin, this.currentY + 22)
        .lineTo(this.doc.page.width - this.margin, this.currentY + 22)
        .lineWidth(1).strokeColor('#000000').stroke();
      this.currentY += 35;
    } else {
      this.currentY += fontSize + 8;
    }
  }

  private addText(text: string, options: any = {}): void {
    if (!text || text.trim().length === 0) return;

    const fontSize = options.fontSize || 10;
    const font = options.bold ? 'Helvetica-Bold' : 'Helvetica';
    const lineGap = options.lineGap || 4;

    this.doc.fontSize(fontSize).fillColor('#000000').font(font)
      .text(text, this.margin, this.currentY, {
        width: this.contentWidth,
        align: options.align || 'justify',
        lineGap: lineGap
      });

    this.currentY += this.doc.heightOfString(text, {
      width: this.contentWidth,
      lineGap: lineGap
    }) + (options.spacing || 12);
  }

  private addDataRow(label: string, value: string): void {
    this.doc.fontSize(10).fillColor('#000000').font('Helvetica-Bold')
      .text(`${label}:`, this.margin + 20, this.currentY, { width: 120 });
    this.doc.fontSize(10).fillColor('#000000').font('Helvetica')
      .text(value, this.margin + 150, this.currentY, { width: this.contentWidth - 150 });
    this.currentY += 16;
  }

  private checkPageBreak(spaceNeeded: number): boolean {
    if (this.currentY + spaceNeeded > this.doc.page.height - 80) {
      this.addFooter();
      this.pageNumber++;
      this.currentY = this.margin;
      return true;
    }
    return false;
  }

  private addFooter(): void {
    this.doc.fontSize(8).fillColor('#000000').font('Helvetica')
      .text(`Page ${this.pageNumber}`, this.margin, this.doc.page.height - 40, {
        align: 'center',
        width: this.contentWidth
      });
  }

  generateCoverPage(product: any, analysis: any, aiContent: any): void {
    this.doc.fontSize(26).fillColor('#000000').font('Helvetica-Bold')
      .text('PRODUCT TRANSPARENCY REPORT', this.margin, this.currentY, {
        align: 'center',
        width: this.contentWidth
      });
    this.currentY += 50;

    this.doc.fontSize(20).fillColor('#000000').font('Helvetica-Bold')
      .text(product.name, this.margin, this.currentY, {
        align: 'center',
        width: this.contentWidth
      });
    this.currentY += 40;

    this.doc.fontSize(14).fillColor('#000000').font('Helvetica-Bold')
      .text('Report Information', this.margin, this.currentY);
    this.currentY += 25;

    this.addDataRow('Product Name', product.name);
    this.addDataRow('Manufacturer', product.company);
    this.addDataRow('Category', product.category.charAt(0).toUpperCase() + product.category.slice(1));
    this.addDataRow('Report Date', new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }));
    this.addDataRow('Report ID', `TR-${product.id}-${new Date().getFullYear()}`);
    this.addDataRow('Total Data Points', `${analysis.totalDataPoints}`);

    this.currentY += 30;

    if (aiContent.executiveSummary && aiContent.executiveSummary.trim()) {
      this.addHeader('Executive Summary');
      this.addText(aiContent.executiveSummary, { spacing: 15 });
    }

    if (analysis.totalDataPoints > 0) {
      this.addHeader('Transparency Assessment', 2);

      this.doc.fontSize(11).fillColor('#000000').font('Helvetica-Bold')
        .text('Assessment Results', this.margin, this.currentY);
      this.currentY += 20;

      const metrics = [
        `Completeness Score: ${analysis.completenessScore.toFixed(1)}%`,
        `Risk Assessment: ${analysis.riskLevel}`,
        analysis.safetyRelated > 0 ? `Safety Documentation: ${analysis.safetyRelated} items` : null,
        analysis.complianceRelated > 0 ? `Compliance Records: ${analysis.complianceRelated} items` : null,
        analysis.qualityRelated > 0 ? `Quality Specifications: ${analysis.qualityRelated} items` : null,
        analysis.environmentalRelated > 0 ? `Environmental Data: ${analysis.environmentalRelated} items` : null
      ].filter(Boolean);

      metrics.forEach((metric, index) => {
        const col = index % 2 === 0 ? this.margin + 20 : this.margin + 260;
        const row = Math.floor(index / 2);
        this.doc.fontSize(10).fillColor('#000000').font('Helvetica')
          .text(`• ${metric}`, col, this.currentY + (row * 16));
      });

      this.currentY += Math.ceil(metrics.length / 2) * 16 + 25;
    }
  }

  generateDetailedAnalysis(product: any, answers: any[], aiContent: any): void {
    this.checkPageBreak(100);
    this.currentY += 10;
    this.addHeader('Product Information & Analysis');

    if (product.description && product.description.trim()) {
      this.addHeader('Product Description', 2);
      this.addText(product.description, { spacing: 18 });
    }

    if (aiContent.keyFindings && aiContent.keyFindings.length > 0) {
      this.checkPageBreak(100);
      this.addHeader('Key Findings', 2);

      const meaningfulFindings = aiContent.keyFindings.filter((finding: string) =>
        finding && finding.trim().length > 0 && !finding.includes('0 total data points')
      );

      meaningfulFindings.forEach((finding: string) => {
        this.doc.fontSize(10).fillColor('#000000').font('Helvetica')
          .text(`• ${finding}`, this.margin + 20, this.currentY, {
            width: this.contentWidth - 40,
            align: 'left',
            lineGap: 4
          });
        this.currentY += this.doc.heightOfString(`• ${finding}`, {
          width: this.contentWidth - 40,
          lineGap: 4
        }) + 10;
      });
      this.currentY += 10;
    }

    if (aiContent.transparencyAnalysis && aiContent.transparencyAnalysis.trim()) {
      this.checkPageBreak(80);
      this.addHeader('Transparency Analysis', 2);
      this.addText(aiContent.transparencyAnalysis, { spacing: 18 });
    }
  }

  generateDetailedProductData(answers: any[]): void {
    if (answers.length === 0) return;

    this.checkPageBreak(100);
    this.addHeader('Detailed Product Data');

    const categorizedAnswers = {
      safety: [] as any[],
      compliance: [] as any[],
      quality: [] as any[],
      environmental: [] as any[],
      technical: [] as any[],
      other: [] as any[]
    };

    answers.forEach(answer => {
      if (!answer.value || answer.value.trim().length === 0) return;

      const questionText = answer.question_text.toLowerCase();
      if (questionText.includes('safety') || questionText.includes('allergen') || questionText.includes('hazard')) {
        categorizedAnswers.safety.push(answer);
      } else if (questionText.includes('certification') || questionText.includes('compliance') || questionText.includes('standard')) {
        categorizedAnswers.compliance.push(answer);
      } else if (questionText.includes('quality') || questionText.includes('ingredient') || questionText.includes('specification')) {
        categorizedAnswers.quality.push(answer);
      } else if (questionText.includes('environment') || questionText.includes('sustainable') || questionText.includes('organic')) {
        categorizedAnswers.environmental.push(answer);
      } else if (questionText.includes('technical') || questionText.includes('performance') || questionText.includes('capacity')) {
        categorizedAnswers.technical.push(answer);
      } else {
        categorizedAnswers.other.push(answer);
      }
    });

    const categories = [
      { name: 'Safety & Health Information', data: categorizedAnswers.safety },
      { name: 'Compliance & Certifications', data: categorizedAnswers.compliance },
      { name: 'Quality Specifications', data: categorizedAnswers.quality },
      { name: 'Environmental Impact', data: categorizedAnswers.environmental },
      { name: 'Technical Specifications', data: categorizedAnswers.technical },
      { name: 'Additional Information', data: categorizedAnswers.other }
    ];

    categories.forEach(category => {
      if (category.data.length > 0) {
        this.checkPageBreak(60);

        this.doc.fontSize(13).fillColor('#000000').font('Helvetica-Bold')
          .text(category.name, this.margin, this.currentY);
        this.currentY += 22;

        category.data.forEach((answer, index) => {
          this.checkPageBreak(60);

          this.doc.fontSize(10).fillColor('#000000').font('Helvetica-Bold')
            .text(`${index + 1}. ${answer.question_text}`, this.margin + 20, this.currentY, {
              width: this.contentWidth - 40,
              lineGap: 3
            });
          this.currentY += this.doc.heightOfString(`${index + 1}. ${answer.question_text}`, {
            width: this.contentWidth - 40,
            lineGap: 3
          }) + 6;

          this.doc.fontSize(10).fillColor('#000000').font('Helvetica')
            .text(answer.value, this.margin + 20, this.currentY, {
              width: this.contentWidth - 40,
              align: 'justify',
              lineGap: 4
            });
          this.currentY += this.doc.heightOfString(answer.value, {
            width: this.contentWidth - 40,
            lineGap: 4
          }) + 16;
        });

        this.currentY += 8;
      }
    });
  }

  generateConclusionsAndRecommendations(aiContent: any): void {
    this.checkPageBreak(10);
    this.addHeader('Conclusions & Recommendations');

    if (aiContent.complianceAssessment && aiContent.complianceAssessment.trim()) {
      this.addHeader('Compliance Assessment', 2);
      this.addText(aiContent.complianceAssessment, { spacing: 18 });
    }

    if (aiContent.conclusions && aiContent.conclusions.trim()) {
      this.addHeader('Conclusions', 2);
      this.addText(aiContent.conclusions, { spacing: 18 });
    }

    if (aiContent.recommendations && aiContent.recommendations.length > 0) {
      this.addHeader('Recommendations', 2);

      aiContent.recommendations.forEach((rec: string) => {
        if (rec && rec.trim().length > 0) {
          this.doc.fontSize(10).fillColor('#000000').font('Helvetica')
            .text(`• ${rec}`, this.margin + 20, this.currentY, {
              width: this.contentWidth - 40,
              align: 'left',
              lineGap: 4
            });
          this.currentY += this.doc.heightOfString(`• ${rec}`, {
            width: this.contentWidth - 40,
            lineGap: 4
          }) + 10;
        }
      });
      this.currentY += 10;
    }

    this.checkPageBreak(60);

    this.doc.fontSize(11).fillColor('#000000').font('Helvetica-Bold')
      .text('Report Certification', this.margin, this.currentY);
    this.currentY += 18;

    this.doc.fontSize(10).fillColor('#000000').font('Helvetica')
      .text('This report has been generated by the Product Transparency Portal and contains verified product information as submitted by the manufacturer. Report generated on ' +
        new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + '.',
        this.margin, this.currentY, {
        width: this.contentWidth,
        align: 'justify',
        lineGap: 4
      });

  }

  getDocument(): PDFKit.PDFDocument {
    return this.doc;
  }
}

export const generatePDFReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const productResult = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];

    const answersResult = await pool.query(`
      SELECT 
        a.value, 
        q.text as question_text, 
        q.type,
        a.created_at as answer_date
      FROM answers a
      JOIN questions q ON a.question_id = q.id
      WHERE a.product_id = $1
      ORDER BY q.sort_order ASC, q.id ASC
    `, [id]);

    const answers = answersResult.rows;


    if (req.user && product.user_id && product.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied to this product' });
    }

    if (answers.length === 0) {
      return res.status(400).json({
        error: 'Cannot generate report: No product data available. Please complete the product submission form first.'
      });
    }

    const analysis = createComprehensiveAnalysis(product, answers);

    const aiContent = await generateAIReportContent(product, answers, analysis);

    const reportGenerator = new PDFReportGenerator();
    const doc = reportGenerator.getDocument();

    doc.info.Title = `Product Transparency Report - ${product.name}`;
    doc.info.Author = 'Product Transparency Portal';
    doc.info.Subject = 'Product Transparency Report';
    doc.info.Keywords = 'transparency, product, compliance, regulatory';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="transparency-report-${product.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`);

    doc.on('error', (err) => {
      console.error('PDF generation error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'PDF generation failed' });
      }
    });

    doc.pipe(res);

    reportGenerator.generateCoverPage(product, analysis, aiContent);
    reportGenerator.generateDetailedAnalysis(product, answers, aiContent);
    reportGenerator.generateDetailedProductData(answers);
    reportGenerator.generateConclusionsAndRecommendations(aiContent);

    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to generate PDF report',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};